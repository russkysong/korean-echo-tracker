'use client';

import dynamic from 'next/dynamic';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';
import { patterns } from '@/lib/patterns';
import { PolicyTable } from '@/components/PolicyTable';
import { HistoricTimeline } from '@/components/HistoricTimeline';

const GlobalMap = dynamic(
  () => import('@/components/GlobalMap').then((m) => m.GlobalMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[480px] bg-zinc-900 rounded-3xl animate-pulse border border-zinc-800" />
    ),
  }
);

export default function TrackerPage() {
  const { isEnglish } = useLocale();
  const verifiedCount = patterns.filter((p) => p.sourceVerified).length;

  const latestEcho =
    patterns
      .map((p) => {
        const parts = p.date.split('→');
        return parts[parts.length - 1].trim().match(/\b(19|20)\d{2}\b/)?.[0] || '';
      })
      .filter(Boolean)
      .sort()
      .pop() || '—';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <header className="border-b border-emerald-500/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl tracking-tighter text-emerald-400">
                KOREA ECHO TRACKER
              </h1>
              <p className="text-xl text-zinc-400 mt-2">
                {isEnglish
                  ? 'Global script → Korean mirror (curated rows).'
                  : '글로벌 스크립트 → 한국 미러(큐레이션 행).'}
              </p>
            </div>
            <LanguageToggle />
          </div>
          <p className="mt-4 flex flex-wrap gap-3">
            <a
              href="/matrix"
              className="inline-flex items-center gap-2 text-sm font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-2xl px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
            >
              <span className="text-emerald-500">◇</span>{' '}
              {isEnglish
                ? 'Networked Global Governance Matrix (Kelly) — read first'
                : 'Kelly 매트릭스(거버넌스 10네트워크) — 먼저 보기'}
            </a>
            <a
              href="/assembly"
              className="inline-flex items-center gap-2 text-sm font-mono text-amber-400/95 hover:text-amber-300 border border-amber-500/30 rounded-2xl px-4 py-2 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            >
              <span className="text-amber-500">◎</span>{' '}
              {isEnglish ? 'MoLEG (gov. notices)' : '입법예고(MoLEG)'}
            </a>
          </p>
          <div className="flex items-center gap-2 mt-6 text-xs">
            <span className="px-4 py-1 bg-emerald-900/80 text-emerald-300 rounded-full">
              {patterns.length}{' '}
              {isEnglish ? 'patterns ·' : '개 패턴 ·'} {verifiedCount}{' '}
              {isEnglish ? 'marked verified in data' : '개 데이터상 검증됨'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-12">
        <GlobalMap />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-center">
            <div className="text-emerald-400 text-sm">{isEnglish ? 'Patterns tracked' : '추적 패턴 수'}</div>
            <div className="text-5xl font-bold text-white">{patterns.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-center">
            <div className="text-emerald-400 text-sm">
              {isEnglish ? 'Latest year (heuristic)' : '최근 연도(휴리스틱)'}
            </div>
            <div className="text-5xl font-bold text-white">{latestEcho}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-center">
            <div className="text-emerald-400 text-sm">{isEnglish ? 'Verified (data flag)' : '검증 비율(데이터)'}</div>
            <div className="text-5xl font-bold text-white">
              {patterns.length ? Math.round((verifiedCount / patterns.length) * 100) : 0}%
            </div>
          </div>
        </div>

        <PolicyTable />
        <HistoricTimeline />
      </main>
    </div>
  );
}
