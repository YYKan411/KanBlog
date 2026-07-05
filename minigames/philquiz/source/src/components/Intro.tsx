import { useLanguage } from '../context/LanguageContext';

interface IntroProps {
  onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
  const { t } = useLanguage();

  return (
    <section className="panel intro-panel">
      <p className="lede">
        {t({
          zh: '想像深夜吧枱，燈光偏暗，有人問你一系列「如果……」——不是考你背書，而是看你如何取捨。',
          en: 'Picture a late bar: dim light, and someone keeps asking "what if…" — not testing recall, but how you trade off.',
        })}
      </p>
      <ul className="intro-list">
        <li>{t({ zh: '24 題核心傾向 + 8 題情境試題', en: '24 core tendency questions + 8 scenario dilemmas' })}</li>
        <li>{t({ zh: '6 條哲學軸線：倫理、認識、存在、社群、態度、傳統', en: '6 philosophical axes: ethics, knowing, existence, community, stance, tradition' })}</li>
        <li>{t({ zh: '16 位世界各地思想家——含第二、第三匹配', en: '16 thinkers worldwide — with secondary & tertiary matches' })}</li>
        <li>{t({ zh: '約 8–12 分鐘；進度會保存在本機', en: 'About 8–12 minutes; progress saved locally' })}</li>
      </ul>
      <p className="fine-print">
        {t({
          zh: '結果是「傾向相似」，不是身份認同。每一位思想家都有盲点——你的也是。',
          en: 'Results show tendency, not identity. Every thinker has blind spots — so do you.',
        })}
      </p>
      <button type="button" className="primary-btn" onClick={onStart}>
        {t({ zh: '開始第一杯', en: 'Pour the first round' })}
      </button>
    </section>
  );
}
