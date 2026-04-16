'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';
import {
  matrixChainKo,
  matrixKoreaRows,
  matrixThesisEn,
  matrixThesisKo,
} from '@/lib/matrix-korea-proof';

export default function MatrixPage() {
  const { isEnglish } = useLocale();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <header className="border-b border-emerald-500/20 px-6 py-10 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-6">
            <LanguageToggle />
          </div>
          <p className="font-mono text-emerald-500/90 text-xs tracking-widest uppercase mb-3">Instrumentality lens</p>
          <h1 className="font-mono text-3xl md:text-4xl tracking-tight text-emerald-400">
            Networked Global Governance Matrix
          </h1>

          {isEnglish ? (
            <>
              <p className="text-emerald-200/95 mt-5 text-xl font-semibold leading-snug border-l-2 border-emerald-500/50 pl-4">
                Why does Korea matter as a case study for UN-linked governance networks?
              </p>
              <p className="text-zinc-400 mt-4 text-sm leading-relaxed max-w-2xl">
                Ten Kelly lanes below: what shows up in Korea, a highlight, a &quot;so what&quot; line, and a primary
                source — same structure for every row.
              </p>
            </>
          ) : (
            <>
              <p className="text-zinc-300 mt-4 text-base leading-relaxed">
                대한민국이 이 구조 안에서 어떻게 작동하는지를 추적합니다 — 글로벌 스크립트가 국내 법·행정·재판에 어떤 흔적을
                남기는지.
              </p>
              <p className="text-emerald-200/90 mt-4 text-lg font-medium leading-snug">
                한국은 왜 UN 거버넌스 네트워크의 중요한 사례인가?
              </p>
              <p className="text-zinc-500 mt-4 text-sm leading-relaxed max-w-2xl">
                Kelly의 10개 네트워크 각각에 대해, 한국에서 관찰되는 증거 한 줄·하이라이트·출처·그리고 &quot;그래서 왜
                중요한가&quot;를 붙였습니다.
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-4 mt-8 text-sm font-mono">
            <Link href="/tracker" className="text-sky-400 hover:text-emerald-400 underline underline-offset-4">
              {isEnglish ? '← Tracker' : '← 트래커'}
            </Link>
            <Link href="/copykiller" className="text-sky-400 hover:text-emerald-400 underline underline-offset-4">
              CopyKiller
            </Link>
            <Link href="/assembly" className="text-sky-400 hover:text-emerald-400 underline underline-offset-4">
              {isEnglish ? 'MoLEG' : '입법예고'}
            </Link>
            <Link href="/" className="text-zinc-500 hover:text-zinc-300">
              {isEnglish ? 'Home' : '홈'}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:px-8 space-y-20 md:space-y-24 pb-28">
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-zinc-950/80 p-8 md:p-10 shadow-[0_0_60px_-20px_rgba(16,185,129,0.25)]">
          <h2 className="font-mono text-emerald-400 text-lg mb-2">
            {isEnglish ? 'How it runs as a machine' : '작동 원리 · How it runs as a machine'}
          </h2>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-6">The thesis — read this first</p>
          <p className="text-zinc-200 text-[15px] md:text-base leading-[1.75] mb-8">{matrixThesisEn}</p>
          {!isEnglish && (
            <>
              <blockquote className="border-l-2 border-emerald-500/70 pl-5 py-1 text-zinc-100 text-[15px] md:text-base leading-[1.85]">
                {matrixThesisKo}
              </blockquote>
              <p className="mt-8 font-mono text-sm text-emerald-300/95 bg-zinc-900/80 rounded-2xl px-5 py-4 border border-emerald-500/20">
                {matrixChainKo}
              </p>
            </>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10">
          <h2 className="font-mono text-emerald-400 text-lg mb-4 border-b border-emerald-500/20 pb-3">
            Kelly (primary framing)
          </h2>
          <blockquote className="text-zinc-200 leading-[1.75] border-l-2 border-emerald-500/50 pl-5 italic text-[15px] md:text-base">
            James P. Kelly III argues that a &apos;matrix&apos; of ten interconnected human-rights governance networks lets
            the UN influence economic and social policy worldwide without formal treaties or direct democratic consent from
            member states.
          </blockquote>
          {!isEnglish && (
            <p className="text-zinc-300 mt-6 text-[15px] leading-[1.8]">
              유엔은 공식 조약이나 회원국 국민의 직접적 동의 없이도, 열 개의 상호 연결된 인권 거버넌스 네트워크를 통해 전
              세계의 경제·사회 정책에 영향을 미칠 수 있다는 분석입니다 (Kelly).
            </p>
          )}
          <p className="text-xs text-zinc-500 mt-6 font-mono">
            Source: James P. Kelly III —{' '}
            <a
              href="https://fedsoc.org/commentary/publications/the-matrix-of-human-rights-governance-networks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-emerald-400"
            >
              The Matrix of Human Rights Governance Networks
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-mono text-emerald-400 text-xl mb-1">
            {isEnglish ? 'Ten networks — Korea evidence' : '10개의 네트워크 — 한국의 현실'}
          </h2>
          <p className="text-zinc-500 text-sm mb-2">
            {isEnglish
              ? 'Kelly lane → proof → highlight → therefore → source'
              : '켈리 레인 → 한국 실증 → 하이라이트 → 그래서 → 출처'}
          </p>
          {!isEnglish && (
            <p className="text-zinc-400 text-sm leading-relaxed mb-12 max-w-2xl">
              각 카드: Kelly 레인 → 한국 실증(영·한) → 하이라이트 → 그래서 무엇이든가 → 출처.
            </p>
          )}
          <ol className="space-y-10 md:space-y-12">
            {matrixKoreaRows.map((row) => (
              <li
                key={row.n}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-emerald-500/25 transition-colors"
              >
                <div className="flex gap-4 p-6 md:p-7 border-b border-zinc-800/90">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-sm font-mono font-bold">
                    {row.n}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="text-white font-medium text-[17px]">{row.title}</div>
                    <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{row.role}</p>
                  </div>
                </div>
                <div className="p-6 md:p-7 space-y-5 bg-zinc-950/30">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/90">
                      {isEnglish ? 'Korea proof' : '한국 실증 · Korea proof'}
                    </span>
                    <p className="text-zinc-200 text-[15px] mt-2 leading-[1.75]">{row.koreaProof}</p>
                    {!isEnglish && (
                      <p className="text-zinc-400 text-[15px] mt-3 leading-[1.8] border-l border-zinc-700 pl-4">
                        {row.koreaProofKo}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-4 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/90">Highlight</span>
                    <p className="text-emerald-100/95 text-sm font-medium leading-relaxed">{row.highlight}</p>
                    {!isEnglish && (
                      <p className="text-emerald-200/80 text-sm leading-relaxed pt-1 border-t border-emerald-500/15">
                        {row.highlightKo}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] px-5 py-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/90">Therefore</span>
                    <p className="text-zinc-300 text-sm mt-2 leading-relaxed">{row.therefore}</p>
                    {!isEnglish && (
                      <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{row.thereforeKo}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Source</span>
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sky-400 hover:text-emerald-400 text-sm underline underline-offset-2 break-all"
                    >
                      {row.sourceLabel}
                    </a>
                    {!isEnglish && row.sourceLabelKo && row.sourceUrlKo ? (
                      <a
                        href={row.sourceUrlKo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sky-400/90 hover:text-emerald-400/90 text-sm underline underline-offset-2 break-all"
                      >
                        {row.sourceLabelKo}
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-10 space-y-8">
          <h2 className="font-mono text-emerald-400 text-lg">References</h2>
          <div>
            <p className="text-zinc-500 text-xs font-mono uppercase mb-3">English / international</p>
            <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed">
              <li>
                <a
                  href="https://fedsoc.org/commentary/publications/the-matrix-of-human-rights-governance-networks"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kelly — Matrix of Human Rights Governance Networks
                </a>
              </li>
              <li>
                <a
                  href="https://www.globaldetentionproject.org/countries/asia-pacific/south-korea"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Global Detention Project — South Korea
                </a>
              </li>
              <li>
                <a
                  href="https://www.ohchr.org/en/hr-bodies/upr/upr-republic-of-korea-stakeholder-info-s14"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OHCHR — UPR Republic of Korea (stakeholders)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-mono uppercase mb-3">
              {isEnglish ? 'Korean institutions & portals' : '한국 독자용 · Primary domestic / KR portals'}
            </p>
            <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed">
              <li>
                <a
                  href="https://www.law.go.kr/"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  국가법령정보센터 (law.go.kr)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ccourt.go.kr/"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  헌법재판소
                </a>
                {' · '}
                <a
                  href="https://english.ccourt.go.kr/"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Constitutional Court (EN)
                </a>
              </li>
              <li>
                <a
                  href="https://www.humanrights.go.kr/"
                  className="text-sky-400 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  국가인권위원회
                </a>
              </li>
              <li>
                <a href="https://www.moj.go.kr/" className="text-sky-400 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">
                  법무부
                </a>
              </li>
            </ul>
          </div>
          <p className="text-zinc-400 text-sm leading-[1.8] border-t border-zinc-800 pt-6">
            {isEnglish
              ? 'When sharing or citing, keep the links above. Read alongside other tracker patterns (CBDC, AI Act, health drills, etc.) to compare how the same matrix logic repeats across issues.'
              : '이 문서를 한국 독자와 공유하거나 연구에 인용하려면 위 출처를 함께 붙여 주세요. Tracker의 다른 패턴(CBDC, AI 기본법, 방역 등)과 병렬로 읽으면 같은 매트릭스가 다른 이슈에서 어떻게 반복되는지 비교할 수 있습니다.'}
          </p>
        </section>
      </main>
    </div>
  );
}
