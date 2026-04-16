'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
  type ReactNode,
} from 'react';

/** `bilingual` = current KO+EN mix; `english` = UI and chrome in full English (previous-style). */
export type AppLocale = 'bilingual' | 'english';

const STORAGE_KEY = 'korea-echo-locale';

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (v: AppLocale) => void;
  /** Shorthand for English UI mode. */
  isEnglish: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('bilingual');

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === 'english' || s === 'bilingual') {
        startTransition(() => setLocaleState(s));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((v: AppLocale) => {
    setLocaleState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      isEnglish: locale === 'english',
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: 'bilingual',
      setLocale: () => {},
      isEnglish: false,
    };
  }
  return ctx;
}
