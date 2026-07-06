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
          src="/images/philquiz-cover.webp?v=9a8c35e"
          alt={t({ zh: '深夜街頭，一人靜坐沉思', en: 'A lone figure pauses to think on a quiet street' })}
          loading="eager"
        />
      </figure>
      <p className="lede">
        {t({
          zh: '想像深夜傾計：燈光偏暗，有人不斷問你「如果……」——不是考你背書，而是看你的取捨。',
          en: 'Picture a late-night chat: dim light, and someone keeps asking "what if…" — not testing recall, but how you trade off.',
        })}
      </p>
      <ul className="intro-list">
        <li>{t({ zh: '27 題核心傾向 + 9 題情境試題', en: '27 core tendency questions + 9 scenario dilemmas' })}</li>
        <li>{t({ zh: '6 個哲學向度：倫理、認識、存在、社羣、態度、傳統', en: '6 philosophical axes: ethics, knowing, existence, community, stance, tradition' })}</li>
        <li>{t({ zh: '16 位世界各地思想家——附次選及第三匹配', en: '16 thinkers worldwide — with secondary & tertiary matches' })}</li>
        <li>{t({ zh: '約 10–14 分鐘；進度會保存在本機，可以中途離開', en: 'About 10–14 minutes; progress saves locally, leave any time' })}</li>
      </ul>
      <p className="thinker-strip">
        {PHILOSOPHERS.map((p) => t(p.name)).join(' · ')}
      </p>
      <p className="fine-print">
        {t({
          zh: '結果是「傾向相似」，不是身份認同，也不是心理或道德診斷。每一位思想家都有盲點——你的也是。',
          en: 'Results show tendency, not identity — and no psychological or moral diagnosis. Every thinker has blind spots; so do you.',
        })}
      </p>
      <button type="button" className="primary-btn" onClick={onStart}>
        {t({ zh: '開始問卷', en: 'Start the quiz' })}
      </button>
    </section>
  );
}
