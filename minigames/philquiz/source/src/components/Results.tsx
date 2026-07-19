import { useEffect, useMemo, useRef, useState } from 'react';
import { AXES } from '../data/axes';
import { PHILOSOPHER_MAP } from '../data/philosophers';
import { buildInlineResultUrl, buildShareUrl } from '../engine/score';
import type { AxisId, AxisVector, MatchResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ResultsProps {
  matches: MatchResult[];
  vector: AxisVector;
  onRetake: () => void;
  isShareView?: boolean;
}

/** Greedy wrap that breaks CJK per character and Latin per word. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const segments = text.match(/[　-〿一-鿿＀-￯]|[^\s　-〿一-鿿＀-￯]+|\s+/g) ?? [text];
  const lines: string[] = [];
  let line = '';
  for (const seg of segments) {
    if (line && ctx.measureText(line + seg).width > maxWidth) {
      lines.push(line.trimEnd());
      line = seg.trimStart();
    } else {
      line += seg;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

export function Results({ matches, vector, onRetake, isShareView = false }: ResultsProps) {
  const { t } = useLanguage();
  const primary = matches[0];
  const secondary = matches[1];
  const tertiary = matches.slice(2);

  const [openAxis, setOpenAxis] = useState<AxisId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const showToast = (message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  };

  // The axis where the taker and the thinker align most closely (among the
  // thinker's pronounced axes) — an honest, informative headline stat.
  const alignAxis = useMemo(() => {
    const centroid = primary.philosopher.centroid;
    let best = AXES[0];
    let bestDiff = Infinity;
    for (const axis of AXES) {
      if (Math.abs(centroid[axis.id]) < 0.5) continue;
      const diff = Math.abs(vector[axis.id] - centroid[axis.id]);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = axis;
      }
    }
    return best;
  }, [primary, vector]);

  const shareLink = async () => {
    const url = buildShareUrl(primary.philosopher.id, vector);
    const title = `${t(primary.philosopher.name)} — ${t({ zh: '哲學傾向問卷', en: 'Philosophical Tendency Quiz' })}`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(t({ zh: '連結已複製', en: 'Link copied' }));
    } catch {
      prompt(t({ zh: '複製此連結', en: 'Copy this link' }), url);
    }
  };

  const drawCard = (): HTMLCanvasElement => {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const zhSerif = '"Noto Serif HK", "Cormorant Garamond", Georgia, serif';
    const mono = '"JetBrains Mono", Menlo, monospace';

    ctx.fillStyle = '#ebe5d4';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#c9bfa3';
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, W - 112, H - 112);

    ctx.textAlign = 'center';

    ctx.fillStyle = '#75603e';
    ctx.font = `500 26px ${mono}`;
    ctx.fillText(t({ zh: '哲學傾向問卷 · 深夜傾計版', en: 'PHILOSOPHICAL TENDENCY QUIZ' }), W / 2, 108 + 60);

    ctx.fillStyle = '#6a5840';
    ctx.font = `400 30px ${zhSerif}`;
    ctx.fillText(t({ zh: '同我最接近嘅思路', en: 'My closest thought profile' }), W / 2, 260);

    ctx.fillStyle = '#3d2f1f';
    ctx.font = `600 84px ${zhSerif}`;
    const nameLines = wrapText(ctx, t(primary.philosopher.name), W - 240);
    let y = 388;
    for (const line of nameLines) {
      ctx.fillText(line, W / 2, y);
      y += 100;
    }

    ctx.fillStyle = '#6a5840';
    ctx.font = `400 40px ${zhSerif}`;
    ctx.fillText(t(primary.philosopher.epithet), W / 2, y + 8);
    y += 68;

    ctx.fillStyle = '#75603e';
    ctx.font = `400 27px ${mono}`;
    ctx.fillText(`${t(primary.philosopher.era)} · ${t(primary.philosopher.region)}`, W / 2, y + 8);
    y += 70;

    ctx.strokeStyle = '#c9bfa3';
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.lineTo(W - 200, y);
    ctx.stroke();
    y += 84;

    ctx.fillStyle = '#3d2f1f';
    ctx.font = `400 36px ${zhSerif}`;
    const quoteLines = wrapText(ctx, t(primary.philosopher.barQuote), W - 260).slice(0, 5);
    for (const line of quoteLines) {
      ctx.fillText(line, W / 2, y);
      y += 58;
    }

    // Six-axis chart — spacing budgeted so the worst case (two-line name +
    // five quote lines) still clears the footer at H-130.
    let axisY = Math.max(y + 60, 1150);
    const trackLeft = 190;
    const trackRight = W - 190;
    for (const axis of AXES) {
      ctx.fillStyle = '#75603e';
      ctx.font = `400 24px ${mono}`;
      ctx.textAlign = 'left';
      ctx.fillText(t(axis.low), trackLeft, axisY);
      ctx.textAlign = 'right';
      ctx.fillText(t(axis.high), trackRight, axisY);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6a5840';
      ctx.font = `500 26px ${zhSerif}`;
      ctx.fillText(t(axis.label), W / 2, axisY);

      const trackY = axisY + 30;
      ctx.strokeStyle = '#c9bfa3';
      ctx.beginPath();
      ctx.moveTo(trackLeft, trackY);
      ctx.lineTo(trackRight, trackY);
      ctx.stroke();

      const pct = Math.min(1, Math.max(0, (vector[axis.id] + 2) / 4));
      const markerX = trackLeft + pct * (trackRight - trackLeft);
      ctx.fillStyle = '#3a5a3a';
      ctx.beginPath();
      ctx.arc(markerX, trackY, 10, 0, Math.PI * 2);
      ctx.fill();

      axisY += 100;
    }

    ctx.fillStyle = '#75603e';
    ctx.font = `500 28px ${mono}`;
    ctx.fillText('yykan.uk/minigames/philquiz', W / 2, H - 130);

    return canvas;
  };

  const shareCard = async () => {
    try {
      await document.fonts.ready;
      const canvas = drawCard();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('canvas export failed');
      const file = new File([blob], `philquiz-${primary.philosopher.id}.png`, { type: 'image/png' });
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      showToast(t({ zh: '結果卡已儲存', en: 'Card saved' }));
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      showToast(t({ zh: '儲存失敗，請再試一次', en: 'Save failed — please try again' }));
    }
  };

  return (
    <section className="panel results-panel">
      <p className="results-kicker">
        {t(
          isShareView
            ? { zh: '呢位朋友最接近嘅思想輪廓', en: 'Their closest thought profile' }
            : { zh: '你最接近嘅思想輪廓', en: 'Your closest thought profile' },
        )}
      </p>
      <h2 className="results-title">{t(primary.philosopher.name)}</h2>
      <p className="results-epithet">{t(primary.philosopher.epithet)}</p>
      <p className="match-score">
        {t({
          zh: `你同佢最合拍嘅地方：${t(alignAxis.label)}`,
          en: `You align most on “${t(alignAxis.label)}”`,
        })}
      </p>

      <blockquote className="bar-quote">{t(primary.philosopher.barQuote)}</blockquote>

      <div className="meta-grid">
        <div>
          <span className="meta-label">{t({ zh: '年代', en: 'Era' })}</span>
          <span>{t(primary.philosopher.era)}</span>
        </div>
        <div>
          <span className="meta-label">{t({ zh: '地域', en: 'Region' })}</span>
          <span>{t(primary.philosopher.region)}</span>
        </div>
      </div>

      <section className="result-section">
        <h3>{t({ zh: '生平', en: 'Biography' })}</h3>
        {primary.philosopher.biography.map((para) => (
          <p key={para.zh}>{t(para)}</p>
        ))}
      </section>

      <section className="result-section">
        <h3>{t({ zh: '點解你哋會對得上', en: 'How this mirrors your worldview' })}</h3>
        {primary.philosopher.worldviewMatch.map((para) => (
          <p key={para.zh}>{t(para)}</p>
        ))}
      </section>

      <section className="result-section caution">
        <h3>{t({ zh: '不過，你可能漏睇咗……', en: 'What you may be overlooking' })}</h3>
        {primary.philosopher.blindSpots.map((para) => (
          <p key={para.zh}>{t(para)}</p>
        ))}
      </section>

      <section className="result-section">
        <h3>{t({ zh: '六個角度睇你點取捨', en: 'Your six-axis profile' })}</h3>
        <p className="axis-intro">
          {t({
            zh: '每條線由 -2 去到 +2，用同一把尺同思想家比較。撳 ⓘ 可以睇每個角度講緊乜。',
            en: 'Each axis is normalised to -2…+2 on the same scale as thinker profiles. Tap ⓘ to expand glossaries.',
          })}
        </p>
        <div className="axis-grid">
          {AXES.map((axis) => {
            const value = vector[axis.id];
            const pct = Math.round(((value + 2) / 4) * 100);
            const isOpen = openAxis === axis.id;
            return (
              <div key={axis.id} className="axis-row">
                <div className="axis-labels">
                  <span>{t(axis.low)}</span>
                  <span className="axis-center">
                    {t(axis.label)}
                    <button
                      type="button"
                      className="axis-tip"
                      aria-expanded={isOpen}
                      aria-label={t({ zh: `${t(axis.label)} 說明`, en: `${t(axis.label)} glossary` })}
                      onClick={() => setOpenAxis(isOpen ? null : axis.id)}
                    >
                      ⓘ
                    </button>
                  </span>
                  <span>{t(axis.high)}</span>
                </div>
                <div className="axis-track">
                  <div className="axis-marker" style={{ left: `${Math.min(100, Math.max(0, pct))}%` }} />
                </div>
                {isOpen && <p className="axis-glossary">{t(axis.glossary)}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {primary.philosopher.blogLinks.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '如果想再行遠少少', en: 'Further reading on KanBlog' })}</h3>
          <ul className="blog-link-list">
            {primary.philosopher.blogLinks.map((link) => (
              <li key={link.slug}>
                <a href={`/posts/${link.slug}`}>{t(link.title)}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {secondary && (
        <section className="result-section secondary-match">
          <h3>{t({ zh: '第二接近', en: 'Second closest' })}</h3>
          <p className="secondary-name">
            {t(secondary.philosopher.name)} ·{' '}
            {t({ zh: `排第 ${secondary.rank}`, en: `Rank ${secondary.rank}` })}
          </p>
          <p>{t(secondary.philosopher.epithet)}</p>
          <p>{t(secondary.philosopher.worldviewMatch[0])}</p>
        </section>
      )}

      {tertiary.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '另外幾個相近思路', en: 'Other nearby thinkers' })}</h3>
          <ul className="tertiary-list">
            {tertiary.map((item) => (
              <li key={item.philosopher.id}>
                <strong>{t(item.philosopher.name)}</strong>
                <span>{t({ zh: `排第 ${item.rank}`, en: `Rank ${item.rank}` })}</span>
                <p>{t(item.philosopher.epithet)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {primary.philosopher.relatedIds.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '放埋一齊睇', en: 'Read alongside' })}</h3>
          <ul className="related-list">
            {primary.philosopher.relatedIds
              .map((id) => PHILOSOPHER_MAP.get(id))
              .filter(Boolean)
              .map((p) => (
                <li key={p!.id}>
                  <a href={buildInlineResultUrl(p!.id, p!.centroid)}>
                    {t(p!.name)} — {t(p!.epithet)}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div className="results-actions">
        <button type="button" className="primary-btn" onClick={shareLink}>
          {t({ zh: '分享結果', en: 'Share result' })}
        </button>
        <button type="button" className="primary-btn" onClick={shareCard}>
          {t({ zh: '儲存呢張結果卡', en: 'Save result card' })}
        </button>
        <button type="button" className="ghost-btn" onClick={onRetake}>
          {t({ zh: '再答一次', en: 'Take again' })}
        </button>
      </div>

      <p className="fine-print">
        {t({
          zh: '講清楚：呢份唔係學術量表，結果一定受題目點問影響。排名只係話十六個輪廓入面邊個最接近，唔係機率、身份，更加唔係心理或道德判斷。',
          en: 'Disclaimer: not an academic scale — results reflect how the questions are designed. Rankings show which of 16 profiles is nearest, not probability or identity.',
        })}
      </p>

      {toast && <div className="copy-toast" role="status">{toast}</div>}
    </section>
  );
}
