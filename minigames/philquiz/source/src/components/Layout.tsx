import type { ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function Layout({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="app-shell">
      <header className="game-header">
        <div className="game-header-inner">
          <div>
            <a className="back-link" href="/minigames/">
              {t({ zh: '← 小遊戲', en: '← Mini Games' })}
            </a>
            <p className="game-kicker">
              {t({ zh: '深夜傾計版 · 16 位思想家', en: 'Late-night chat · 16 thinkers' })}
            </p>
            <h1 className="game-title">
              {t({ zh: '哲學傾向問卷', en: 'Philosophical Tendency Quiz' })}
            </h1>
            <p className="game-subtitle">
              {t({
                zh: '三十六題，冇標準答案。最後搵出一位同你思路最接近嘅思想家——有偏見，但老實；係傾計，唔係診斷。',
                en: '36 questions, no correct answers. We match you with the thinker whose groove fits yours — a biased-but-honest chat, not diagnosis.',
              })}
            </p>
          </div>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button type="button" className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>
              中
            </button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
        </div>
      </header>
      <main className="game-main">{children}</main>
      <footer className="game-footer">
        <a href="/">© {new Date().getFullYear()} 言又勤</a>
        <span className="dot">·</span>
        <a href="/about">{t({ zh: '關於', en: 'about' })}</a>
        <span className="dot">·</span>
        <a href="/minigames/">{t({ zh: '小遊戲', en: 'mini games' })}</a>
      </footer>
    </div>
  );
}
