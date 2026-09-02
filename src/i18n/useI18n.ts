import { useAccessibilityStore } from '@/accessibility';
import { en, zh, type TranslationKeys } from './translations';

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : path;
}

export function useI18n() {
  const lang = useAccessibilityStore((s) => s.primaryLanguage);
  const dict = lang === 'zh-CN' ? zh : en;

  const t = (key: TranslationKey): string =>
    getNestedValue(dict as unknown as Record<string, unknown>, key);

  return { t, lang, isZh: lang === 'zh-CN' };
}
