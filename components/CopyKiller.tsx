'use client';

import { useMemo, useState } from 'react';
import type { FuseResult } from 'fuse.js';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';
import { createPatternFuse } from '@/lib/pattern-fuse';
import { patterns, type Pattern } from '@/lib/patterns';
import XThreadExporter from './XThreadExporter';

function matchTouchesSearchAliases(matches: FuseResult<Pattern>['matches']): boolean {
  if (!matches?.length) return false;
  return matches.some((m) => m.key === 'searchAliases');
}

export default function CopyKiller() {
  const { isEnglish } = useLocale();
  const [query, setQuery] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const fuse = useMemo(() => createPatternFuse(), []);

  const fuseResults = useMemo(() => {
    if (!query.trim() || !searchTriggered) return [];
    return fuse.search(query);
  }, [query, fuse, searchTriggered]);

  const aliasBadgeById = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const r of fuseResults) {
      const id = r.item.id;
      m.set(id, (m.get(id) ?? false) || matchTouchesSearchAliases(r.matches));
    }
    return m;
  }, [fuseResults]);

  const grouped = useMemo(() => {
    return fuseResults.reduce(
      (acc, r) => {
        const item = r.item;
        item.agendaTags.forEach((tag) => {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(item);
        });
        return acc;
      },
      {} as Record<string, Pattern[]>
    );
  }, [fuseResults]);

  const runScan = () => setSearchTriggered(true);

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-mono text-emerald-400">COPYKILLER</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {isEnglish ? 'Pattern search — fuzzy match across all fields' : '패턴 검색 — 모든 필드 퍼지 매칭'}
          </p>
        </div>
        <LanguageToggle />
      </div>
      <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
        {isEnglish
          ? `Unlike scrolling the table, search here finds partial and fuzzy hits in topics, keywords, sources, and all text columns at once. ${patterns.length} patterns indexed. Editorial aliases are weighted lower and tagged when they drive a match.`
          : `표를 일일이 넘기지 않고, 주제·키워드·출처·전체 텍스트에서 부분·유사 일치를 한 번에 찾습니다. 패턴 ${patterns.length}건. 편집적 별칭은 가중치가 낮고, 일치 시 표시됩니다.`}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runScan()}
          placeholder="digital currency, misinformation, CBDC, …"
          className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-emerald-400 rounded-2xl px-6 py-5 text-lg font-mono outline-none"
        />
        <button
          type="button"
          onClick={runScan}
          className="bg-emerald-500 hover:bg-emerald-400 px-10 rounded-2xl font-mono text-black font-bold"
        >
          SCAN
        </button>
      </div>

      {Object.keys(grouped).length > 0 && (
        <div className="mt-10 space-y-10">
          {Object.entries(grouped).map(([agenda, items]) => (
            <div key={agenda}>
              <div className="text-emerald-400 font-mono text-lg border-b border-emerald-500/30 pb-2 mb-4">
                🌐 {agenda}
              </div>
              {items.map((item) => (
                <div
                  key={`${agenda}-${item.id}`}
                  className="border border-zinc-700 rounded-2xl p-6 mb-4 hover:border-emerald-400/50 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs bg-emerald-900 text-emerald-300 px-3 py-1 rounded-full">
                      {item.topic}
                    </span>
                    {aliasBadgeById.get(item.id) && (
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/50 text-amber-200/90 bg-amber-950/50"
                        title={
                          isEnglish
                            ? 'Match included editorial / political searchAliases (lower weight than policy keywords)'
                            : '편집적/정치적 searchAliases 필드가 일치에 포함됨(정책 키워드보다 낮은 가중치)'
                        }
                      >
                        {isEnglish ? 'Editorial alias' : '편집 별칭 일치'}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xl text-white">
                    <span className="text-zinc-500 text-sm font-mono block mb-1">Global (EN)</span>
                    {item.globalText}
                  </p>
                  {!isEnglish && (
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      <span className="text-zinc-500" title="Machine translation — not official">
                        Global (KO · MT · unofficial):{' '}
                      </span>
                      {item.globalTextKo}
                    </p>
                  )}
                  <p className={`mt-4 text-emerald-300 text-lg leading-relaxed ${isEnglish ? 'mt-3' : ''}`}>
                    <span className="text-emerald-500/80 text-sm font-mono block mb-1">
                      {isEnglish ? 'Korean mirror (KO)' : '한국 미러 (KO)'}
                    </span>
                    {item.koreanText}
                  </p>
                  <a
                    href={item.koreanSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sky-400 hover:text-emerald-400 text-sm underline"
                  >
                    🇰🇷 {item.koreanSourceLabelKo || '한국 쪽 출처'}
                  </a>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-4">
                    <span className="text-xs text-zinc-500">Timeline: {item.date}</span>
                    <XThreadExporter patternId={item.id} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
