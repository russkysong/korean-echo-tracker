'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { getClipboardOrigin } from '@/lib/public-origin';
import { useLocale } from '@/lib/locale-context';
import { patterns } from '@/lib/patterns';
import { chunkForX, hardSplit, MAX_POST_CHARS } from '@/lib/thread-chunks';
import XThreadExporter from './XThreadExporter';

/** Copy a single-pattern thread to clipboard; shows a toast on result. */
async function copyPatternThread(patternId: string): Promise<void> {
  const item = patterns.find((p) => p.id === patternId);
  if (!item) {
    toast.error('Pattern not found.');
    return;
  }

  let fullText = `🧬 ${item.topic}\n\n`;
  fullText += `Global (EN): ${item.globalText}\n`;
  fullText += `Global (MT KO): ${item.globalTextKo}\n`;
  fullText += `Korean mirror (KO): ${item.koreanText}\n`;
  fullText += `Timeline: ${item.date}\n`;
  fullText += `KR source: ${item.koreanSourceLabelKo}\n${item.koreanSource}`;

  const origin = getClipboardOrigin();
  const footer = `\n\n🔗 ${origin}/tracker  #KoreaEcho`;

  let posts = chunkForX(fullText);
  if (posts.length === 0) {
    posts = [footer.trim()];
  } else {
    const merged = `${posts[posts.length - 1]}${footer}`;
    if (merged.length <= MAX_POST_CHARS) {
      posts[posts.length - 1] = merged;
    } else {
      posts.push(footer.trim());
    }
  }
  posts = posts.flatMap((p) => hardSplit(p, MAX_POST_CHARS));

  const numbered = posts.map((post, i) => `${i + 1}/${posts.length}\n${post}`);
  const finalThread = numbered.join('\n\n');

  try {
    await navigator.clipboard.writeText(finalThread);
    toast.success(`"${item.topic}" thread copied (${posts.length} post${posts.length > 1 ? 's' : ''}).`);
  } catch {
    toast.error('Clipboard blocked — use the header export for a manual-copy fallback.');
  }
}

export function PolicyTable() {
  const { isEnglish } = useLocale();
  const [filter, setFilter] = useState('all');

  const filtered = patterns.filter(
    (p) => filter === 'all' || p.agendaTags.includes(filter)
  );

  const hasKellyMatrixTags = patterns.some((p) => p.agendaTags.includes('Advocacy networks'));

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
      {hasKellyMatrixTags && (
        <details className="text-zinc-500 text-xs mb-6 max-w-4xl leading-relaxed">
          <summary className="cursor-pointer text-emerald-500/90 font-mono">
            {isEnglish ? 'About the ten “Advocacy networks …” filter chips' : 'Kelly 매트릭스 필터(옹호·연구·…·자금) 안내'}
          </summary>
          <p className="mt-2 pl-1 border-l border-zinc-700">
            {isEnglish
              ? 'These labels come from James P. Kelly’s ten governance-network types. Only the “Networked Global Governance Matrix” row carries all ten; use them to isolate that row or explore related wording in the dataset.'
              : 'James P. Kelly의 인권 거버넌스 10유형입니다. 해당 태그를 모두 가진 행은 매트릭스 패턴 한 줄이며, /matrix에서 레인별 근거를 봅니다.'}
          </p>
        </details>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          {['all', ...new Set(patterns.flatMap((p) => p.agendaTags))].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`px-6 py-2 rounded-2xl text-sm font-mono transition-colors ${
                filter === tag ? 'bg-emerald-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Bulk export stays in the header */}
        <XThreadExporter filteredPatterns={filtered} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1280px] table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
            <col className="w-[24%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[3%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-4 px-3 font-mono">TOPIC</th>
              <th className="text-left py-4 px-3 font-mono">GLOBAL (EN)</th>
              <th
                className="text-left py-4 px-3 font-mono"
                title={
                  isEnglish
                    ? 'Machine translation from English for side-by-side comparison — not an official institutional translation.'
                    : '영문을 기계번역한 참고용 열(공식 번역 아님).'
                }
              >
                {isEnglish ? 'GLOBAL (KO · MT)' : '글로벌 (KO · 기계번역)'}
              </th>
              <th className="text-left py-4 px-3 font-mono">
                {isEnglish ? 'KOREAN MIRROR (KO)' : '한국 미러 (KO)'}
              </th>
              <th className="text-left py-4 px-3 font-mono">DELAY</th>
              <th className="text-left py-4 px-3 font-mono">SOURCE (KR)</th>
              <th className="text-left py-4 pl-2 pr-1 font-mono w-12">SHARE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-zinc-800 hover:bg-zinc-800/50 ${
                  item.id === 'matrix-1'
                    ? 'bg-emerald-950/25 ring-1 ring-inset ring-emerald-500/30'
                    : ''
                }`}
              >
                <td className="py-5 px-3 font-medium align-top break-words">
                  {item.id === 'matrix-1' ? (
                    <Link href="/matrix" className="text-emerald-400 hover:underline inline-flex flex-col gap-1">
                      <span>{item.topic}</span>
                      <span className="text-[10px] font-mono text-emerald-500/80 normal-case">
                        {isEnglish ? 'Read this frame first →' : '프레임 요약 → /matrix'}
                      </span>
                    </Link>
                  ) : (
                    item.topic
                  )}
                </td>
                <td className="py-5 px-3 font-mono text-zinc-200 align-top text-[13px] leading-relaxed break-words">
                  {item.globalText}
                </td>
                <td className="py-5 px-3 text-zinc-400 align-top text-xs leading-relaxed break-words">
                  {item.globalTextKo}
                </td>
                <td className="py-5 px-3 font-mono text-emerald-300 align-top text-sm leading-relaxed break-words">
                  {item.koreanText}
                </td>
                <td className="py-5 px-3 text-amber-300 font-mono align-top text-xs leading-snug break-words">
                  {item.date}
                </td>
                <td className="py-5 px-3 align-top break-words min-w-0">
                  <a
                    href={item.koreanSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline text-xs leading-snug block"
                    title={item.koreanSource}
                  >
                    {item.koreanSourceLabelKo}
                  </a>
                </td>
                <td className="py-5 pl-2 pr-1 align-top w-12">
                  {/* Icon-only share button — compact, tooltip describes the action */}
                  <button
                    type="button"
                    title={`Copy X thread for "${item.topic}"`}
                    aria-label={`Copy X thread for ${item.topic}`}
                    onClick={() => void copyPatternThread(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-sky-500 hover:text-black transition-colors text-base"
                  >
                    📤
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-zinc-600 text-[11px] mt-4 font-sans leading-relaxed">
          {isEnglish
            ? 'MT column: machine-translated Korean from the English global line — for wording comparison only, not a certified translation.'
            : '기계번역 열: 영문 글로벌 문장을 한국어로 자동 번역한 참고용이며, 공식 번역이 아닙니다.'}
        </p>
      </div>
    </div>
  );
}
