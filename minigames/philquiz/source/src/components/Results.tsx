import { AXES } from '../data/axes';
import { PHILOSOPHER_MAP } from '../data/philosophers';
import { buildShareUrl } from '../engine/score';
import type { AxisVector, MatchResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ResultsProps {
  matches: MatchResult[];
  vector: AxisVector;
  onRetake: () => void;
  isShareView?: boolean;
}

export function Results({ matches, vector, onRetake, isShareView = false }: ResultsProps) {
  const { t } = useLanguage();
  const primary = matches[0];
  const secondary = matches[1];
  const tertiary = matches.slice(2);

  const copyShare = async () => {
    const url = buildShareUrl(primary.philosopher.id, vector, secondary?.philosopher.id);
    try {
      await navigator.clipboard.writeText(url);
      alert(t({ zh: '連結已複製', en: 'Link copied' }));
    } catch {
      prompt(t({ zh: '複製此連結', en: 'Copy this link' }), url);
    }
  };

  return (
    <section className="panel results-panel">
      <p className="results-kicker">
        {t(
          isShareView
            ? { zh: '分享的思想輪廓', en: 'Shared thought profile' }
            : { zh: '你目前最接近的思想輪廓', en: 'Your closest thought profile' },
        )}
      </p>
      <h2 className="results-title">{t(primary.philosopher.name)}</h2>
      <p className="results-epithet">{t(primary.philosopher.epithet)}</p>
      <p className="match-score">
        {t({
          zh: `16 位思想家中的第 ${primary.rank} 位共鳴`,
          en: `Resonance rank ${primary.rank} of 16 thinkers`,
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
        <h3>{t({ zh: '這如何反映你的世界觀', en: 'How this mirrors your worldview' })}</h3>
        {primary.philosopher.worldviewMatch.map((para) => (
          <p key={para.zh}>{t(para)}</p>
        ))}
      </section>

      <section className="result-section caution">
        <h3>{t({ zh: '你可能忽略了什麼', en: 'What you may be overlooking' })}</h3>
        {primary.philosopher.blindSpots.map((para) => (
          <p key={para.zh}>{t(para)}</p>
        ))}
      </section>

      <section className="result-section">
        <h3>{t({ zh: '你的六個向度', en: 'Your six-axis profile' })}</h3>
        <p className="axis-intro">
          {t({
            zh: '各軸已正規化至 -2 至 +2，與思想家輪廓同一尺度。滑鼠或點按 ⓘ 可查看各軸解釋。',
            en: 'Each axis is normalised to -2…+2 on the same scale as thinker profiles. Hover or tap ⓘ for glossaries.',
          })}
        </p>
        <div className="axis-grid">
          {AXES.map((axis) => {
            const value = vector[axis.id];
            const pct = Math.round(((value + 2) / 4) * 100);
            return (
              <div key={axis.id} className="axis-row">
                <div className="axis-labels">
                  <span>{t(axis.low)}</span>
                  <span className="axis-center">
                    {t(axis.label)}
                    <button
                      type="button"
                      className="axis-tip"
                      aria-label={t({ zh: `${t(axis.label)} 說明`, en: `${t(axis.label)} glossary` })}
                      title={t(axis.glossary)}
                    >
                      ⓘ
                    </button>
                  </span>
                  <span>{t(axis.high)}</span>
                </div>
                <div className="axis-track">
                  <div className="axis-marker" style={{ left: `${Math.min(100, Math.max(0, pct))}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {primary.philosopher.blogLinks.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '站內延伸閱讀', en: 'Further reading on KanBlog' })}</h3>
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
          <h3>{t({ zh: '次要共鳴', en: 'Secondary resonance' })}</h3>
          <p className="secondary-name">
            {t(secondary.philosopher.name)} ·{' '}
            {t({ zh: `第 ${secondary.rank} 位`, en: `Rank ${secondary.rank}` })}
          </p>
          <p>{t(secondary.philosopher.epithet)}</p>
          <p>{t(secondary.philosopher.worldviewMatch[0])}</p>
        </section>
      )}

      {tertiary.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '其他相近思路', en: 'Other nearby thinkers' })}</h3>
          <ul className="tertiary-list">
            {tertiary.map((item) => (
              <li key={item.philosopher.id}>
                <strong>{t(item.philosopher.name)}</strong>
                <span>{t({ zh: `第 ${item.rank} 位`, en: `Rank ${item.rank}` })}</span>
                <p>{t(item.philosopher.epithet)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {primary.philosopher.relatedIds.length > 0 && (
        <section className="result-section">
          <h3>{t({ zh: '延伸對讀', en: 'Read alongside' })}</h3>
          <ul className="related-list">
            {primary.philosopher.relatedIds
              .map((id) => PHILOSOPHER_MAP.get(id))
              .filter(Boolean)
              .map((p) => (
                <li key={p!.id}>
                  <a href={buildShareUrl(p!.id, p!.centroid)}>
                    {t(p!.name)} — {t(p!.epithet)}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div className="results-actions">
        <button type="button" className="primary-btn" onClick={copyShare}>
          {t({ zh: '複製分享連結', en: 'Copy share link' })}
        </button>
        <button type="button" className="ghost-btn" onClick={onRetake}>
          {t({ zh: '再玩一次', en: 'Take again' })}
        </button>
      </div>

      <p className="fine-print">
        {t({
          zh: '免責：本問卷非學術量表，結果受題目設計影響；為趣味傾向配對，不構成心理、學術或道德判斷。排名只表示在 16 位人物中哪個輪廓最接近，並非機率或身份認同。',
          en: 'Disclaimer: not an academic scale — results reflect how the questions are designed. Rankings show which of 16 profiles is nearest, not probability or identity.',
        })}
      </p>
    </section>
  );
}
