import { PHILOSOPHERS } from '../data/philosophers';
import { useLanguage } from '../context/LanguageContext';

interface IntroProps {
  onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
  const { t } = useLanguage();

  return (
    <section className="panel intro-panel">
      <figure className="intro-hero">
        <img
          src="/images/philquiz-cover.webp?v=20260719"
          alt={t({ zh: '深夜酒吧枱面上嘅問卷卡、鋼筆、思想家肖像卡同一杯威士忌', en: 'Question cards, a pen, philosopher portraits and a whisky on a late-night bar table' })}
          loading="eager"
        />
      </figure>
      <p className="lede">
        {t({
          zh: '想像深夜傾計：燈光偏暗，有人一路問你「如果……」——唔係考你背書，只係想睇你點取捨。',
          en: 'Picture a late-night chat: dim light, and someone keeps asking "what if…" — not testing recall, but how you trade off.',
        })}
      </p>
      <ul className="intro-list">
        <li>{t({ zh: '27 題日常取捨 + 9 個兩難處境', en: '27 everyday trade-offs + 9 scenario dilemmas' })}</li>
        <li>{t({ zh: '六條軸：倫理、認識、存在、社羣、態度、傳統', en: '6 philosophical axes: ethics, knowing, existence, community, stance, tradition' })}</li>
        <li>{t({ zh: '16 位世界各地思想家——仲會話你知第二、第三接近邊個', en: '16 thinkers worldwide — with your second and third closest matches' })}</li>
        <li>{t({ zh: '大約 10–14 分鐘；做到一半可以走開，進度留喺呢部機', en: 'About 10–14 minutes; progress stays on this device, so leave any time' })}</li>
      </ul>
      <p className="thinker-strip">
        {PHILOSOPHERS.map((p) => t(p.name)).join(' · ')}
      </p>
      <p className="fine-print">
        {t({
          zh: '結果只係話你同邊種思路較近，唔代表你就係嗰個人，更加唔係心理或道德診斷。每位思想家都有盲點——你同我都一樣。',
          en: 'Results show tendency, not identity — and no psychological or moral diagnosis. Every thinker has blind spots; so do you.',
        })}
      </p>
      <button type="button" className="primary-btn" onClick={onStart}>
        {t({ zh: '開始傾', en: 'Start the quiz' })}
      </button>
    </section>
  );
}
