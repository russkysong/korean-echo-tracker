/**
 * Base URL for share footers (X threads). Browser uses current origin; otherwise
 * NEXT_PUBLIC_APP_ORIGIN or localhost:3000.
 */
export function getClipboardOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const env = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  return env && env.length > 0 ? env : 'http://localhost:3000';
}
