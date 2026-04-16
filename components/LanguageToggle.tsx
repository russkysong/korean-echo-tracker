'use client';

import { useLocale, type AppLocale } from '@/lib/locale-context';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  const btn = (value: AppLocale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(value)}
      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
        locale === value
          ? 'bg-emerald-500 text-black font-bold'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-zinc-700 bg-zinc-900/90 p-1 backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Display language mode"
    >
      {btn('english', 'English')}
      {btn('bilingual', 'KO + EN')}
    </div>
  );
}
