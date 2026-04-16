'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';

export function HomeContent() {
  const { isEnglish } = useLocale();

  return (
    <main className="min-h-screen px-6 py-12 md:py-16 max-w-2xl mx-auto font-sans text-zinc-100">
      <div className="flex justify-end mb-8">
        <LanguageToggle />
      </div>

      <h1 className="font-mono text-4xl md:text-5xl text-emerald-400 mb-4 tracking-tight">Korea Echo Tracker</h1>
      <p className="text-lg text-zinc-200 leading-relaxed font-medium">
        Forensic truth-dashboard — global script → Korean mirror
      </p>

      <p className="text-zinc-400 mt-6 leading-[1.75] text-[15px]">
        {isEnglish
          ? 'Curated evidence chains for how international agendas (health, money, identity, speech, migration, climate, and UN-linked governance networks) show up in Korean law, agencies, and courts. Built for investigators, journalists, and citizens who want primary documents and timelines — not opinion-only threads.'
          : '국제 의제(보건·화폐·신원·표현·이주·기후·유엔형 거버넌스 네트워크 등)가 한국 법·행정·재판에 어떻게 나타나는지 정리한 증거 사슬입니다. 조사·보도·시민 독자를 위해: 원문 링크와 타임라인을 우선합니다.'}
      </p>

      {!isEnglish && (
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-emerald-400/90 text-sm font-mono uppercase tracking-wider mb-3">한국어 안내</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            이 대시보드는 패턴 테이블(/tracker), 세계 지도, 퍼지 검색(CopyKiller), Kelly 매트릭스(/matrix), 정부 입법예고 모니터(/assembly),
            연구용 CSV (Research Station)로 구성됩니다. CopyKiller·Research Station은 도구 이름이며, 화면 상단에서{' '}
            <span className="text-emerald-400/90">English</span> / <span className="text-emerald-400/90">KO + EN</span>{' '}
            표시를 바꿀 수 있습니다.
          </p>
        </section>
      )}

      <p className="text-amber-200/90 mt-8 text-sm font-medium">
        {isEnglish
          ? 'Start here: open /tracker for the full pattern table, map, and X-ready exports.'
          : '처음이시면 /tracker에서 전체 패턴 표·지도·X 스레드 내보내기부터 보세요.'}
      </p>

      <nav className="mt-10 space-y-5 font-mono text-[15px]">
        <p className="text-zinc-600 text-xs uppercase tracking-wider mb-2">Routes</p>
        <ul className="space-y-4">
          <li>
            <Link className="text-sky-400 hover:text-emerald-400 hover:underline underline-offset-4" href="/tracker">
              /tracker
            </Link>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">
              {isEnglish ? 'Map, stats, policy table, X thread export' : '지도·통계·정책 표·X 스레드 내보내기'}
            </span>
          </li>
          <li>
            <Link className="text-sky-400 hover:text-emerald-400 hover:underline underline-offset-4" href="/copykiller">
              /copykiller
            </Link>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">
              {isEnglish ? 'Fuzzy keyword search across all pattern fields' : '모든 패턴 필드 퍼지 키워드 검색'}
            </span>
          </li>
          <li>
            <Link className="text-sky-400 hover:text-emerald-400 hover:underline underline-offset-4" href="/matrix">
              /matrix
            </Link>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">
              {isEnglish
                ? 'Kelly 10-network matrix + Korea evidence by lane'
                : 'Kelly 10개 네트워크 + 레인별 한국 실증'}
            </span>
          </li>
          <li>
            <Link className="text-sky-400 hover:text-emerald-400 hover:underline underline-offset-4" href="/assembly">
              {isEnglish ? 'MoLEG' : '입법예고'}
            </Link>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">
              {isEnglish
                ? 'Legislative pre-announcement keyword monitor (Open API)'
                : '입법예고 키워드 모니터(열린국회정보 API)'}
            </span>
          </li>
          <li>
            <Link className="text-sky-400 hover:text-emerald-400 hover:underline underline-offset-4" href="/research">
              /research
            </Link>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">
              {isEnglish ? 'Research Station: CSV import/export & TS export' : '연구 스테이션: CSV 가져오기·내보내기·TS 내보내기'}
            </span>
          </li>
        </ul>
      </nav>
    </main>
  );
}
