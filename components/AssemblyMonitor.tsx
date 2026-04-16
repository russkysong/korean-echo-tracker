'use client';

import Link from 'next/link';
import { Fragment, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';
import { revalidateAssemblyMonitor } from '@/app/assembly/actions';
import type { AssemblyMonitorState, PatternMatchResult } from '@/lib/assembly-api';
import { LAWMAKING_GCOM_OGLMPP, molegGcomKeywordUrl } from '@/lib/lawmaking-api';

function formatWhen(iso: string, isEnglish: boolean): string {
  try {
    const d = new Date(iso);
    return isEnglish ? d.toLocaleString('en-US') : d.toLocaleString('ko-KR');
  } catch {
    return iso;
  }
}

function errorBannerText(
  state: AssemblyMonitorState,
  isEnglish: boolean
): { title: string; body: string } | null {
  if (!state.apiError) return null;
  if (state.apiError === 'invalid_key') {
    return {
      title: isEnglish ? 'Invalid OC (lawmaking API)' : '입법 API OC가 올바르지 않습니다',
      body: state.apiMessage ?? (isEnglish ? 'Check LAWMAKING_OC in .env.local.' : 'LAWMAKING_OC를 확인하세요.'),
    };
  }
  if (state.apiError === 'rate_limit') {
    return {
      title: isEnglish ? 'Rate limited (429)' : '요청 제한(429)',
      body: isEnglish
        ? 'Try Refresh later. Showing empty or stale layout.'
        : '잠시 후 다시 시도하세요. 목록은 비어 있을 수 있습니다.',
    };
  }
  if (state.apiError === 'network') {
    return {
      title: isEnglish ? 'Network error' : '네트워크 오류',
      body: state.apiMessage ?? '',
    };
  }
  return {
    title: isEnglish ? 'API error' : 'API 오류',
    body: state.apiMessage ?? '',
  };
}

export function AssemblyMonitor({
  state,
  agendaTagOptions,
}: {
  state: AssemblyMonitorState;
  agendaTagOptions: string[];
}) {
  const { isEnglish } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const filterChips = useMemo(() => ['all', ...agendaTagOptions], [agendaTagOptions]);

  const filteredResults = useMemo(() => {
    const list =
      filter === 'all'
        ? state.results
        : state.results.filter((r) => r.agendaTags.includes(filter));
    return [...list].sort((a, b) => b.totalCount - a.totalCount);
  }, [state.results, filter]);

  const err = errorBannerText(state, isEnglish);

  function molegKeywordLink(kw: string): string {
    return molegGcomKeywordUrl(kw);
  }

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function refresh() {
    startTransition(() => {
      void (async () => {
        try {
          await revalidateAssemblyMonitor();
          router.refresh();
          toast.success(isEnglish ? 'Cache cleared — reloading.' : '캐시 갱신 후 다시 불러옵니다.');
        } catch {
          toast.error(isEnglish ? 'Refresh failed' : '새로고침 실패');
        }
      })();
    });
  }

  function latestDate(r: PatternMatchResult): string {
    if (r.bills.length === 0) return '—';
    const dates = r.bills.map((b) => b.proposedDate).filter(Boolean);
    if (!dates.length) return '—';
    return dates.sort((a, b) => b.localeCompare(a))[0];
  }

  function patternMolegLink(r: PatternMatchResult): string {
    const q = r.matchedKeywords[0] ?? r.topic;
    return molegGcomKeywordUrl(q);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <header className="border-b border-amber-500/20 px-6 py-10 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6">
            <LanguageToggle />
          </div>
          <p className="font-mono text-amber-500/90 text-xs tracking-widest uppercase mb-3">
            {isEnglish ? 'Government legislative notice (MoLEG)' : '정부 입법예고 (법제처)'}
          </p>
          <h1 className="font-mono text-3xl md:text-4xl tracking-tight text-amber-400">
            {isEnglish ? 'MoLEG keyword monitor' : '입법예고 키워드 모니터'}
          </h1>
          <p className="text-zinc-400 mt-4 text-sm leading-relaxed max-w-3xl">
            {state.dataMode === 'pal_only' ? (
              <>
                {isEnglish
                  ? 'No LAWMAKING_OC — the server does not call opinion.lawmaking.go.kr. Use the links to search 정부 입법예고 in your browser (국민참여입법센터). Browse: '
                  : 'LAWMAKING_OC 없음 — 서버에서 입법 REST를 호출하지 않습니다. 표의 링크로 브라우저에서 정부 입법예고를 검색하세요. 목록: '}
                <a
                  href={LAWMAKING_GCOM_OGLMPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-amber-400 underline underline-offset-4"
                >
                  opinion.lawmaking.go.kr
                </a>
              </>
            ) : (
              <>
                {isEnglish
                  ? 'Government legislative notices (ogLmPp XML, in progress) matched to each pattern’s keywords. Same family as moleg.go.kr — browse: '
                  : '국민참여입법센터 입법예고 XML(진행)과 패턴 키워드 매칭. 법제처와 동일 계열 — 둘러보기: '}
                <a
                  href={LAWMAKING_GCOM_OGLMPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-amber-400 underline underline-offset-4"
                >
                  opinion.lawmaking.go.kr
                </a>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-4 mt-8 text-sm font-mono">
            <Link href="/tracker" className="text-sky-400 hover:text-amber-400 underline underline-offset-4">
              {isEnglish ? '← Tracker' : '← 트래커'}
            </Link>
            <Link href="/copykiller" className="text-sky-400 hover:text-amber-400 underline underline-offset-4">
              CopyKiller
            </Link>
            <Link href="/matrix" className="text-sky-400 hover:text-amber-400 underline underline-offset-4">
              Matrix
            </Link>
            <Link href="/" className="text-zinc-500 hover:text-zinc-300">
              {isEnglish ? 'Home' : '홈'}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 md:px-8 pb-28 space-y-8">
        {state.dataMode === 'pal_only' && !state.apiError && (
          <div className="rounded-3xl border border-emerald-500/35 bg-emerald-950/20 px-6 py-5 text-sm text-zinc-200">
            <p className="font-mono font-semibold text-emerald-300">
              {isEnglish ? 'Link-only mode (no LAWMAKING_OC)' : '링크 전용(LAWMAKING_OC 없음)'}
            </p>
            <p className="mt-2 text-zinc-400 leading-relaxed">
              {isEnglish
                ? 'Notice counts stay at 0 — add LAWMAKING_OC for server-side XML. Expand a row for per-keyword links to 국민참여입법센터 search.'
                : '예고 건수는 0입니다 — 서버 조회를 쓰려면 LAWMAKING_OC를 설정하세요. 행을 펼치면 키워드별 입법예고 검색 링크가 있습니다.'}
            </p>
          </div>
        )}

        {err && (
          <div className="rounded-3xl border border-red-500/30 bg-red-950/25 px-6 py-5 text-sm text-red-100">
            <p className="font-mono font-semibold">{err.title}</p>
            <p className="mt-2 text-zinc-300 leading-relaxed">{err.body}</p>
            <p className="mt-3 text-zinc-500 text-xs">
              {isEnglish
                ? 'Keyword links to the MoLEG browser search still work below.'
                : '아래 표의 키워드 검색 링크는 그대로 사용할 수 있습니다.'}
            </p>
            <a
              href="https://www.lawmaking.go.kr/api/apiGuideInfo?type=4-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sky-400 hover:text-amber-400 underline"
            >
              lawmaking.go.kr — {isEnglish ? 'API guide (OC)' : '오픈API 안내(OC)'}
            </a>
          </div>
        )}

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
            <div>
              <p className="text-zinc-500 text-xs uppercase">{isEnglish ? 'Notices (unique)' : '예고(고유)'}</p>
              <p className="text-2xl text-emerald-400">{state.totalBillsUnique}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase">
                {isEnglish ? 'Pattern–notice links' : '패턴·예고 연결 수'}
              </p>
              <p className="text-2xl text-amber-400">{state.totalBillRows}</p>
            </div>
            <div className="col-span-2">
              <p className="text-zinc-500 text-xs uppercase">{isEnglish ? 'ogLmPp REST' : 'ogLmPp REST'}</p>
              <p className="text-zinc-200 font-mono text-sm">
                {state.dataMode === 'api' ? (isEnglish ? 'on (live counts)' : '사용 중(실시간)') : (isEnglish ? 'off' : '미사용')}
              </p>
              <p className="text-zinc-500 text-xs uppercase mt-3">{isEnglish ? 'Last updated' : '갱신 시각'}</p>
              <p className="text-zinc-200">{formatWhen(state.fetchedAtIso, isEnglish)}</p>
              {state.stale && (
                <p className="text-xs text-amber-500/90 mt-1">
                  {isEnglish ? 'Partial / stale' : '부분·만료 상태일 수 있음'}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={isPending}
            className="rounded-2xl border border-amber-500/40 bg-amber-500/15 px-6 py-3 text-sm font-mono text-amber-200 hover:bg-amber-500/25 disabled:opacity-50"
          >
            {isPending ? '…' : isEnglish ? 'Refresh' : '새로고침'}
          </button>
        </section>

        <section className="flex flex-wrap gap-2">
          {filterChips.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`px-5 py-2 rounded-2xl text-sm font-mono transition-colors ${
                filter === tag ? 'bg-emerald-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </section>

        <section className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full text-sm min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-500 font-mono text-xs uppercase">
                <th className="py-4 px-4">{isEnglish ? 'Topic' : '주제'}</th>
                <th className="py-4 px-4">
                  {state.dataMode === 'pal_only'
                    ? isEnglish
                      ? 'Echo terms → MoLEG search'
                      : 'Echo 검색어 → 입법센터'
                    : isEnglish
                      ? 'Matched keywords'
                      : '일치 키워드'}
                </th>
                <th className="py-4 px-4 w-24">{isEnglish ? 'Rows' : '건수'}</th>
                <th className="py-4 px-4">{isEnglish ? 'Latest notice date' : '최근 공고일'}</th>
                <th className="py-4 px-4 w-28">{isEnglish ? 'Link' : '링크'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => {
                const active =
                  r.totalCount > 0 ||
                  (state.dataMode === 'pal_only' && r.matchedKeywords.length > 0);
                return (
                  <Fragment key={r.patternId}>
                    <tr
                      onClick={() => toggleRow(r.patternId)}
                      className={`border-b border-zinc-800/80 cursor-pointer hover:bg-zinc-800/40 ${
                        active ? 'bg-emerald-950/10' : 'bg-zinc-950/20'
                      }`}
                    >
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            active ? 'bg-emerald-500' : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-zinc-100 font-medium">{r.topic}</span>
                      </td>
                      <td className="py-4 px-4 align-top text-zinc-400 text-xs max-w-md">
                        {r.matchedKeywords.length ? r.matchedKeywords.join(', ') : '—'}
                      </td>
                      <td className="py-4 px-4 align-top font-mono text-amber-300">{r.totalCount}</td>
                      <td className="py-4 px-4 align-top text-zinc-500 font-mono text-xs">{latestDate(r)}</td>
                      <td className="py-4 px-4 align-top">
                        <a
                          href={patternMolegLink(r)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sky-400 hover:text-emerald-400 text-xs underline"
                        >
                          MoLEG
                        </a>
                      </td>
                    </tr>
                    {expanded.has(r.patternId) && (
                      <tr className="bg-zinc-950/80">
                        <td colSpan={5} className="px-4 pb-6 pt-0">
                          {r.bills.length === 0 && state.dataMode === 'pal_only' && r.matchedKeywords.length > 0 ? (
                            <div className="py-4 space-y-3">
                              <p className="text-zinc-500 text-sm">
                                {isEnglish
                                  ? 'Open each keyword on 국민참여입법센터 (browser — no OC on server):'
                                  : '키워드별 국민참여입법센터 검색(브라우저 · 서버 OC 불필요):'}
                              </p>
                              <ul className="flex flex-wrap gap-2">
                                {r.matchedKeywords.map((kw) => (
                                  <li key={kw}>
                                    <a
                                      href={molegKeywordLink(kw)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex text-xs font-mono px-3 py-1.5 rounded-full border border-sky-500/40 text-sky-300 hover:bg-sky-500/10"
                                    >
                                      {kw}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : r.bills.length === 0 ? (
                            <p className="text-zinc-500 text-sm py-4">
                              {isEnglish ? 'No notices matched for this pattern.' : '이 패턴에 매칭된 입법예고가 없습니다.'}
                            </p>
                          ) : (
                            <ul className="space-y-4 pt-2">
                              {r.bills.map((b) => (
                                <li
                                  key={`${r.patternId}-${b.billId}`}
                                  className="rounded-2xl border border-zinc-800 p-4"
                                >
                                  <p className="text-zinc-100 font-medium">{b.billName}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {b.triggerKeywords.map((kw) => (
                                      <span
                                        key={kw}
                                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30"
                                      >
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 font-mono">
                                    <div>
                                      <dt className="text-zinc-600">{isEnglish ? 'Ministry' : '소관 부처'}</dt>
                                      <dd>{b.proposer || '—'}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-zinc-600">{isEnglish ? 'Instrument type' : '법령 종류'}</dt>
                                      <dd>{b.committee || '—'}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-zinc-600">{isEnglish ? 'Notice date' : '공고일'}</dt>
                                      <dd>{b.proposedDate || '—'}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-zinc-600">{isEnglish ? 'Status' : '상태'}</dt>
                                      <dd>{b.status || '—'}</dd>
                                    </div>
                                  </dl>
                                  <a
                                    href={b.detailUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 text-sky-400 hover:text-amber-400 text-xs underline"
                                  >
                                    {isEnglish ? 'Open notice' : '예고 상세'}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
