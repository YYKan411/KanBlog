import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../types';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (text: { zh: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'zh';
  const tag = navigator.language.toLowerCase();
  return tag.startsWith('zh') ? 'zh' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (text: { zh: string; en: string }) => text[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
