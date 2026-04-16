'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from '@/lib/locale-context';
import { patterns as originalPatterns, type Pattern } from '@/lib/patterns';
import XThreadExporter from '@/components/XThreadExporter';

const TS_HEADER = `export interface Pattern {
  id: string;
  topic: string;
  globalText: string;
  globalTextKo: string;
  koreanText: string;
  agendaTags: string[];
  relatedKeywords: string[];
  searchAliases?: string[];
  globalSource: string;
  koreanSource: string;
  koreanSourceLabelKo: string;
  date: string;
  similarityHint: string;
  sourceVerified: boolean;
}
`;

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
  return ok;
}

function showManualCopyModal(text: string) {
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
  const box = document.createElement('div');
  box.style.cssText =
    'background:#18181b;color:#e4e4e7;border:1px solid #3f3f46;border-radius:16px;max-width:720px;width:100%;padding:20px;font-family:ui-monospace,monospace;';
  const p = document.createElement('p');
  p.style.marginBottom = '12px';
  p.textContent = 'Clipboard blocked. Copy manually from the box below.';
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText =
    'width:100%;height:320px;background:#27272a;color:#fafafa;padding:12px;border-radius:8px;border:1px solid #52525b;font-size:12px;resize:vertical;';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Close';
  btn.style.cssText =
    'margin-top:14px;background:#10b981;color:#0a0a0a;padding:10px 20px;border-radius:9999px;font-weight:700;border:none;cursor:pointer;';
  btn.onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  box.appendChild(p);
  box.appendChild(ta);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  ta.focus();
  ta.select();
}

export default function ResearchStation() {
  const { isEnglish } = useLocale();
  const [currentPatterns, setCurrentPatterns] = useState<Pattern[]>(originalPatterns);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const [tweakMap, setTweakMap] = useState<Record<string, boolean>>({});
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const savedVerified = localStorage.getItem('korea-echo-verified');
      const savedTweak = localStorage.getItem('korea-echo-tweak');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydrating from localStorage on mount
      if (savedVerified) setVerifiedMap(JSON.parse(savedVerified));
      if (savedTweak) setTweakMap(JSON.parse(savedTweak));
    } catch {
      console.warn('localStorage parse failed — starting clean');
    }
    setStorageReady(true);
  }, []);

  const parseCSV = (text: string): Pattern[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const data: Pattern[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const next = line[j + 1];
        if (char === '"' && !inQuotes) {
          inQuotes = true;
        } else if (char === '"' && inQuotes && next === '"') {
          current += '"';
          j++;
        } else if (char === '"' && inQuotes) {
          inQuotes = false;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);

      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = values[idx]
          ? values[idx].replace(/^"|"$/g, '').replace(/""/g, '"')
          : '';
      });

      const row: any = { ...obj };
      row.agendaTags = row.agendaTags
        ? String(row.agendaTags).split('|').filter(Boolean)
        : [];
      row.relatedKeywords = row.relatedKeywords
        ? String(row.relatedKeywords).split('|').filter(Boolean)
        : [];
      row.searchAliases = row.searchAliases
        ? String(row.searchAliases).split('|').filter(Boolean)
        : [];
      row.sourceVerified = row.sourceVerified === 'true' || row.sourceVerified === true;
      row.globalTextKo = row.globalTextKo ?? '';
      row.koreanSourceLabelKo = row.koreanSourceLabelKo ?? '';

      data.push(row as Pattern);
    }
    return data.filter((row) => row.id);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const imported = parseCSV(text);
        if (imported.length === 0) return;

        setCurrentPatterns(imported);

        setVerifiedMap((prev) => {
          const next = { ...prev };
          for (const p of imported) {
            if (!(p.id in next)) next[p.id] = p.sourceVerified;
          }
          return next;
        });

        const ids = new Set(imported.map((p) => p.id));
        setTweakMap((prev) => {
          const next: Record<string, boolean> = {};
          for (const id of ids) {
            next[id] = prev[id] ?? false;
          }
          return next;
        });

        toast.success(`Imported ${imported.length} patterns. Verification merged for new ids only.`);
      } catch {
        toast.error('CSV parse error — check the header row');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem('korea-echo-verified', JSON.stringify(verifiedMap));
  }, [verifiedMap, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem('korea-echo-tweak', JSON.stringify(tweakMap));
  }, [tweakMap, storageReady]);

  const toggleVerified = (id: string) => {
    setVerifiedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  const toggleTweak = (id: string) => {
    setTweakMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const exportCSV = () => {
    const headers =
      'id,topic,globalText,globalTextKo,koreanText,date,agendaTags,relatedKeywords,searchAliases,globalSource,koreanSource,koreanSourceLabelKo,similarityHint,sourceVerified,needsTweak\n';
    const rows = currentPatterns
      .map((p) =>
        [
          `"${p.id}"`,
          `"${p.topic}"`,
          `"${p.globalText.replace(/"/g, '""')}"`,
          `"${(p.globalTextKo ?? '').replace(/"/g, '""')}"`,
          `"${p.koreanText.replace(/"/g, '""')}"`,
          `"${p.date}"`,
          `"${p.agendaTags.join('|')}"`,
          `"${p.relatedKeywords.join('|')}"`,
          `"${(p.searchAliases ?? []).join('|')}"`,
          `"${p.globalSource.replace(/"/g, '""')}"`,
          `"${p.koreanSource.replace(/"/g, '""')}"`,
          `"${(p.koreanSourceLabelKo ?? '').replace(/"/g, '""')}"`,
          `"${p.similarityHint.replace(/"/g, '""')}"`,
          `${verifiedMap[p.id] ?? p.sourceVerified}`,
          `${tweakMap[p.id] ?? false}`,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'korea-echo-patterns.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTsCode = async () => {
    const payload = currentPatterns.map((p) => ({
      ...p,
      sourceVerified: verifiedMap[p.id] ?? p.sourceVerified,
    }));
    const code = `${TS_HEADER}\nexport const patterns: Pattern[] = ${JSON.stringify(payload, null, 2)};\n`;

    try {
      await navigator.clipboard.writeText(code);
      toast.success(isEnglish ? 'TypeScript copied — paste into lib/patterns.ts' : 'TypeScript 복사됨 — lib/patterns.ts에 붙여넣기');
    } catch {
      if (fallbackCopy(code)) {
        toast.success('Copied via fallback');
      } else {
        showManualCopyModal(code);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <h1 className="text-3xl md:text-4xl text-emerald-400">RESEARCH STATION</h1>
              <LanguageToggle />
            </div>
            <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
              {isEnglish
                ? 'Download all patterns as CSV, edit offline, re-import, or export a TypeScript snippet for lib/patterns.ts. Toggle verification flags for your own review workflow.'
                : '패턴 전체를 CSV로 내려받아 오프라인에서 수정한 뒤 다시 가져오거나, lib/patterns.ts용 TypeScript 조각을 내보냅니다. 검증 토글은 본인 검토용입니다.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl cursor-pointer text-sm font-bold">
              {isEnglish ? 'IMPORT CSV' : 'CSV 가져오기'}
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={exportCSV}
              className="bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-2xl text-black font-bold"
            >
              {isEnglish ? 'EXPORT CSV' : 'CSV 내보내기'}
            </button>
            <button
              type="button"
              onClick={() => void generateTsCode()}
              className="bg-sky-500 hover:bg-sky-400 px-6 py-3 rounded-2xl text-black font-bold"
            >
              {isEnglish ? 'COPY TS EXPORT' : 'TS 내보내기(복사)'}
            </button>
            <span title={isEnglish ? 'Build an X thread from current patterns' : '현재 패턴으로 X 스레드'}>
              <XThreadExporter filteredPatterns={currentPatterns} />
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {currentPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 flex flex-col gap-6 lg:flex-row"
            >
              <div className="flex-1 min-w-0">
                <span className="px-3 py-1 text-xs bg-emerald-900 text-emerald-300 rounded-full">
                  {pattern.topic}
                </span>
                <p className="mt-3 text-white break-words">
                  <span className="text-zinc-500 text-xs block mb-1">Global (EN)</span>
                  {pattern.globalText}
                </p>
                <p className="mt-3 text-zinc-400 text-sm break-words leading-relaxed">
                  <span
                    className="text-zinc-500 text-xs block mb-1"
                    title={
                      isEnglish
                        ? 'Machine-translated from English; not reviewed by an institutional translator.'
                        : '영문 기계번역(공식 번역 아님).'
                    }
                  >
                    {isEnglish ? 'Global (KO · MT · unofficial)' : '글로벌 (KO · 기계번역 · 비공식)'}
                  </span>
                  {pattern.globalTextKo}
                </p>
                <p className="mt-3 text-emerald-300 break-words leading-relaxed">
                  <span className="text-emerald-500/70 text-xs block mb-1">Korean mirror (KO)</span>
                  {pattern.koreanText}
                </p>
                <div className="text-xs text-zinc-500 mt-4">Timeline: {pattern.date}</div>
              </div>

              <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                <a
                  href={pattern.koreanSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-emerald-400 text-sm underline leading-snug"
                >
                  🇰🇷 {pattern.koreanSourceLabelKo || '한국 쪽 출처'}
                </a>
                <a
                  href={pattern.globalSource.includes('http') ? pattern.globalSource : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-emerald-400 text-sm underline"
                >
                  Open global source
                </a>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => toggleVerified(pattern.id)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-colors ${
                      verifiedMap[pattern.id] ?? pattern.sourceVerified
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    {verifiedMap[pattern.id] ?? pattern.sourceVerified
                      ? isEnglish
                        ? '✓ Verified'
                        : '✓ 검증됨'
                      : isEnglish
                        ? 'Mark verified'
                        : '검증 표시'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTweak(pattern.id)}
                    className={`flex-1 border py-3 rounded-2xl font-bold transition-colors ${
                      tweakMap[pattern.id]
                        ? 'border-amber-400 bg-amber-900 text-amber-400'
                        : 'border-zinc-600 hover:bg-zinc-800'
                    }`}
                  >
                    {tweakMap[pattern.id]
                      ? isEnglish
                        ? '⚑ Needs review'
                        : '⚑ 검토 필요'
                      : isEnglish
                        ? 'Flag for review'
                        : '검토 플래그'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
