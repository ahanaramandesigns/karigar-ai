import { createContext, useContext, type PropsWithChildren } from 'react';
import type { Language } from '../types';
import { translate, type UIStringKey } from './strings';

export type { UIStringKey };

const I18nContext = createContext<Language>('en');

export function I18nProvider({ language, children }: PropsWithChildren<{ language: Language }>) {
  return <I18nContext.Provider value={language}>{children}</I18nContext.Provider>;
}

/** Returns a `t(key, vars?)` function bound to the site's current UI language. */
export function useT() {
  const language = useContext(I18nContext);
  return (key: UIStringKey, vars?: Record<string, string | number>) => translate(language, key, vars);
}

/** Returns the current UI language code directly (e.g. for SPEECH_LOCALES lookups). */
export function useUILanguage(): Language {
  return useContext(I18nContext);
}
