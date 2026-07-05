import { AXES } from '../data/axes';
import { PHILOSOPHER_MAP } from '../data/philosophers';
import { buildShareUrl } from '../engine/score';
import type { AxisVector, MatchResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ResultsProps {
  matches: MatchResult[];
  vector: AxisVector;
  onRetake: () => void;
}

export function Results({ matches, vector, onRetake }: ResultsProps) {
  const { t } = useLanguage();
  const primary = matches[0];
  const secondary = matches[1];
  const tertiary = matches.slice(2);

  const copyShare = async () => {
    const url = buildShareUrl(primary.philosopher.id, secondary?.philosopher.id);
    try {
      await navigator.clipboard.writeText(url);
      alert(t({ zh: '連結已複製', en: 'Link copied' }));
    } catch {
      prompt(t({ zh: '複製此連結', en: 'Copy this link' }), url);
    }
  };

  return (
    <section className="panel results-panel">
      <p className="results-kicker">{t({ zh: '你的深夜吧枱側寫', en: 'Your late-night bar profile' })}</p>
      <h2 className="results-title">{t(primary.philosopher.name)}</h2>
      <p className="results-epithet">{t(primary.philosopher.epithet)}</p>
      <p className="match-score">
        {t({ zh: '匹配度', en: 'Match' })} · {primary.similarity}%
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
        <div className="axis-grid">
          {AXES.map((axis) => {
            const value = vector[axis.id];
            const pct = Math.round(((value + 12) / 24) * 100);
            return (
              <div key={axis.id} className="axis-row">
                <div className="axis-labels">
                  <span>{t(axis.low)}</span>
                  <span>{t(axis.label)}</span>
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

      {secondary && (
        <section className="result-section secondary-match">
          <h3>{t({ zh: '次要匹配', en: 'Secondary match' })}</h3>
          <p className="secondary-name">
            {t(secondary.philosopher.name)} · {secondary.similarity}%
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
                <span>{item.similarity}%</span>
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
                  <a href={buildShareUrl(p!.id)}>
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
          zh: '免責：本問卷為趣味傾向配對，不構成心理、學術或道德判斷。哲學家本人若坐在吧枱，大概也並不認同這種歸類。',
          en: 'Disclaimer: this is playful tendency matching — not psychological, academic, or moral judgment. Most philosophers, at the bar, would disagree with being filed this neatly.',
        })}
      </p>
    </section>
  );
}
