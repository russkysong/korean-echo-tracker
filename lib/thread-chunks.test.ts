import { describe, it, expect } from 'vitest';
import { hardSplit, chunkForX, MAX_POST_CHARS } from './thread-chunks';

// ---------------------------------------------------------------------------
// hardSplit
// ---------------------------------------------------------------------------
describe('hardSplit', () => {
  it('returns empty array for empty string', () => {
    expect(hardSplit('', 270)).toEqual([]);
  });

  it('returns the original string when it fits within max', () => {
    const s = 'hello world';
    expect(hardSplit(s, 270)).toEqual([s]);
  });

  it('splits exactly on the boundary', () => {
    const s = 'a'.repeat(540); // exactly 2 × 270
    const chunks = hardSplit(s, 270);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(270);
    expect(chunks[1]).toHaveLength(270);
  });

  it('handles remainder correctly', () => {
    const s = 'a'.repeat(275);
    const chunks = hardSplit(s, 270);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(270);
    expect(chunks[1]).toHaveLength(5);
  });

  it('each chunk length never exceeds max', () => {
    const s = 'x'.repeat(1000);
    for (const chunk of hardSplit(s, 270)) {
      expect(chunk.length).toBeLessThanOrEqual(270);
    }
  });
});

// ---------------------------------------------------------------------------
// chunkForX
// ---------------------------------------------------------------------------
describe('chunkForX', () => {
  it('returns empty array for empty string', () => {
    expect(chunkForX('')).toEqual([]);
  });

  it('returns a single chunk for short text', () => {
    const text = 'Short text that fits easily.';
    const chunks = chunkForX(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it('each chunk never exceeds MAX_POST_CHARS', () => {
    const lines = Array.from({ length: 20 }, (_, i) => `Line ${i}: ${'x'.repeat(60)}`);
    const text = lines.join('\n');
    for (const chunk of chunkForX(text)) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_POST_CHARS);
    }
  });

  it('hard-splits a single line longer than MAX_POST_CHARS', () => {
    const longLine = 'L'.repeat(MAX_POST_CHARS + 50);
    const chunks = chunkForX(longLine);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(MAX_POST_CHARS);
    }
  });

  it('handles a long URL on a single line', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(300);
    const chunks = chunkForX(longUrl);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(MAX_POST_CHARS);
    }
    // Reassembled content should equal the original URL
    expect(chunks.join('')).toBe(longUrl);
  });

  it('footer is appended only to the last post (not repeated)', () => {
    // Simulate the caller behaviour: footer merged onto last chunk
    const body = Array.from({ length: 5 }, (_, i) => `Topic ${i}: ${'word '.repeat(30)}`).join('\n');
    const footer = '\n\n🔗 Full tracker: https://example.com/tracker\n#KoreaEcho';
    let posts = chunkForX(body);
    const merged = `${posts[posts.length - 1]}${footer}`;
    if (merged.length <= MAX_POST_CHARS) {
      posts[posts.length - 1] = merged;
    } else {
      posts.push(footer.trim());
    }

    const footerMatches = posts.filter((p) => p.includes('#KoreaEcho'));
    expect(footerMatches).toHaveLength(1);
  });

  it('consecutive short lines are grouped into the same chunk', () => {
    // 5 lines of 50 chars each = 250 total with newlines — should fit in one chunk
    const lines = Array.from({ length: 5 }, () => 'x'.repeat(40));
    const text = lines.join('\n');
    expect(text.length).toBeLessThan(MAX_POST_CHARS);
    const chunks = chunkForX(text);
    expect(chunks).toHaveLength(1);
  });

  it('does not produce empty chunks', () => {
    const text = '\n\n\nSome text\n\n\nMore text\n\n';
    for (const c of chunkForX(text)) {
      expect(c.trim().length).toBeGreaterThan(0);
    }
  });

  it('handles text that is exactly MAX_POST_CHARS long', () => {
    const text = 'a'.repeat(MAX_POST_CHARS);
    const chunks = chunkForX(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(MAX_POST_CHARS);
  });
});
