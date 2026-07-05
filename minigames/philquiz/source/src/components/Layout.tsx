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
              {t({ zh: '深夜傾計版 · 16 型', en: 'Late-night chat · 16 types' })}
            </p>
            <h1 className="game-title">
              {t({ zh: '哲學傾向問卷', en: 'Philosophical Tendency Quiz' })}
            </h1>
            <p className="game-subtitle">
              {t({
                zh: '34 題，無標準答案。最後會配對一位與你思路最接近的思想家——有偏見但誠實的傾計探索，不是診斷。',
                en: '34 questions, no correct answers. We match you with the thinker whose groove fits yours — a biased-but-honest chat, not diagnosis.',
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
