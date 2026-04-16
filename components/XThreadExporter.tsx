'use client';

import { toast } from 'sonner';
import { getClipboardOrigin } from '@/lib/public-origin';
import { patterns, type Pattern } from '@/lib/patterns';
import { chunkForX, hardSplit, MAX_POST_CHARS } from '@/lib/thread-chunks';

interface XThreadExporterProps {
  patternId?: string;
  filteredPatterns?: Pattern[];
}

function fallbackCopyToClipboard(text: string): boolean {
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
    'background:#18181b;color:#e4e4e7;border:1px solid #3f3f46;border-radius:16px;max-width:640px;width:100%;padding:20px;font-family:ui-monospace,monospace;';

  const p = document.createElement('p');
  p.style.marginBottom = '12px';
  p.textContent = 'Copy blocked. Select the text below and copy manually (⌘C / Ctrl+C).';

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText =
    'width:100%;height:280px;background:#27272a;color:#fafafa;padding:12px;border-radius:8px;border:1px solid #52525b;font-family:inherit;font-size:12px;resize:vertical;';

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

export default function XThreadExporter({ patternId, filteredPatterns }: XThreadExporterProps) {
  const generateThread = async () => {
    const items = patternId
      ? patterns.filter((p) => p.id === patternId)
      : filteredPatterns ?? patterns;

    if (items.length === 0) {
      toast.error('No patterns selected to export.');
      return;
    }

    let fullText = '🧬 KOREA ECHO THREAD\n\n';
    items.forEach((p, i) => {
      fullText += `${i + 1}. ${p.topic}\n`;
      fullText += `Global (EN): ${p.globalText}\n`;
      fullText += `Global (MT KO): ${p.globalTextKo}\n`;
      fullText += `Korean mirror (KO): ${p.koreanText}\n`;
      fullText += `Timeline: ${p.date}\n`;
      fullText += `KR source: ${p.koreanSourceLabelKo}\n${p.koreanSource}\n\n`;
    });

    const origin = getClipboardOrigin();
    const footer = `\n\n🔗 Full tracker: ${origin}/tracker\n#KoreaEcho #GlobalScript`;

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
      toast.success(`Thread ready — ${posts.length} posts copied. Paste each block into X (1/n, 2/n, …).`);
    } catch {
      if (fallbackCopyToClipboard(finalThread)) {
        toast.success('Copied via fallback. Paste each numbered block into X.');
      } else {
        showManualCopyModal(finalThread);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={() => void generateThread()}
      className="bg-sky-500 hover:bg-sky-400 text-black font-mono px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-colors"
    >
      📤 X thread
    </button>
  );
}
