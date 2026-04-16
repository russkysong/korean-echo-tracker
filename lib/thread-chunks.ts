/** Maximum characters per segment body (before the `1/n` counter line). */
export const MAX_POST_CHARS = 270;

/**
 * Hard-split any string longer than `max` at a character boundary.
 * Returns an empty array for an empty input string.
 */
export function hardSplit(text: string, max: number): string[] {
  if (text.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < text.length; i += max) {
    out.push(text.slice(i, i + max));
  }
  return out;
}

/**
 * Line-aware chunker — splits `fullText` into segments that each fit within
 * MAX_POST_CHARS. Any single line that exceeds the limit is hard-split.
 */
export function chunkForX(fullText: string): string[] {
  const chunks: string[] = [];
  let cur = '';

  const flushCur = () => {
    const t = cur.replace(/\n+$/, '').trimEnd();
    if (t) chunks.push(t);
    cur = '';
  };

  for (const line of fullText.split('\n')) {
    if (line.length > MAX_POST_CHARS) {
      flushCur();
      for (let i = 0; i < line.length; i += MAX_POST_CHARS) {
        chunks.push(line.slice(i, i + MAX_POST_CHARS));
      }
      continue;
    }
    const candidate = cur.length === 0 ? line : `${cur}\n${line}`;
    if (candidate.length > MAX_POST_CHARS) {
      flushCur();
      cur = line;
    } else {
      cur = candidate;
    }
  }
  flushCur();
  return chunks.flatMap((c) => hardSplit(c, MAX_POST_CHARS));
}
