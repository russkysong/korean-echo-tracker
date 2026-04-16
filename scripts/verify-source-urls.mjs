/**
 * HTTP check for URLs embedded in lib/patterns.ts and lib/matrix-korea-proof.ts.
 * Run: npm run verify-sources
 *
 * Notes:
 * - Headers include Referer + Accept-Language — some WAFs allow these where bare fetch was 403.
 * - After fetch, 403 → GET retry → curl fallback (different TLS stack; often succeeds on macOS).
 * - law.go.kr: HEAD may be 404 while GET is 200.
 * - Playwright is intentionally not a dependency — use a browser for anything still 403.
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Many CDNs/WAFs reject requests with no Referer or Accept-Language. */
const browserHeaders = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
  Referer: 'https://www.google.com/',
  'Cache-Control': 'no-cache',
};

const re = /https?:\/\/[^\s'"`)]+/g;

function collectUrls() {
  const set = new Set();
  for (const rel of ['lib/patterns.ts', 'lib/matrix-korea-proof.ts']) {
    const t = fs.readFileSync(path.join(root, rel), 'utf8');
    let m;
    while ((m = re.exec(t))) {
      let u = m[0];
      u = u.replace(/[,;.]+$/, '');
      if (u.endsWith('.')) u = u.slice(0, -1);
      set.add(u);
    }
  }
  return [...set].sort();
}

async function fetchStatus(method, url) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctrl.signal,
      headers: browserHeaders,
    });
    return { status: r.status, finalUrl: r.url };
  } catch (e) {
    return { error: String(e?.cause?.message || e?.message || e) };
  } finally {
    clearTimeout(id);
  }
}

/** curl uses LibreSSL/OpenSSL — sometimes passes WAFs that block Node. */
function curlHttpCode(url) {
  try {
    const out = execFileSync(
      'curl',
      [
        '-s',
        '-o',
        '/dev/null',
        '-w',
        '%{http_code}',
        '-L',
        '--max-time',
        '22',
        '-A',
        UA,
        '-e',
        'https://www.google.com/',
        '-H',
        'Accept-Language: en-US,en;q=0.9',
        url,
      ],
      { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 }
    );
    const n = parseInt(String(out).trim(), 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function classify(out, { viaCurl = false } = {}) {
  if (out.status >= 200 && out.status < 400)
    return { ok: true, kind: viaCurl ? 'ok_curl' : 'ok', viaCurl, ...out };
  if (out.status === 403) return { ok: false, kind: 'forbidden', ...out };
  if (out.status === 404 || out.status >= 500)
    return { ok: false, kind: 'broken', ...out };
  if (out.status >= 400) return { ok: false, kind: 'http_error', ...out };
  if (out.error?.includes('certificate') || out.error?.includes('fetch failed'))
    return { ok: false, kind: 'tls_or_network', ...out };
  if (out.error?.includes('redirect') || out.error?.includes('Redirect'))
    return { ok: false, kind: 'redirect_loop', ...out };
  if (out.error) return { ok: false, kind: 'network', ...out };
  return { ok: false, kind: 'unknown', ...out };
}

/** HEAD → GET; curl if Node still sees 403 or TLS failure. */
async function check(url) {
  let out = await fetchStatus('HEAD', url);
  if (out.status === 404 || out.status === 405 || out.status === 501) {
    out = await fetchStatus('GET', url);
  }
  if (out.error) {
    out = await fetchStatus('GET', url);
  }
  if (out.status === 405 || out.status === 501) {
    out = await fetchStatus('GET', url);
  }
  if (out.status === 403) {
    out = await fetchStatus('GET', url);
  }

  if (out.error) {
    const c = classify(out);
    if (c.kind === 'tls_or_network') {
      const code = curlHttpCode(url);
      if (code >= 200 && code < 400) {
        return classify({ status: code, finalUrl: url }, { viaCurl: true });
      }
    }
    return c;
  }

  const result = classify(out);
  if (result.ok) return result;

  if (result.kind === 'forbidden' || out.status === 403) {
    const code = curlHttpCode(url);
    if (code >= 200 && code < 400) {
      return classify({ status: code, finalUrl: url }, { viaCurl: true });
    }
  }

  return result;
}

const urls = collectUrls();
const rows = [];

for (const url of urls) {
  const r = await check(url);
  rows.push({ url, ...r });
  const tag =
    r.kind === 'ok'
      ? 'OK'
      : r.kind === 'ok_curl'
        ? 'OK*'
        : r.kind === 'forbidden'
          ? '403?'
          : r.kind === 'broken'
            ? 'BROKEN'
            : r.kind === 'tls_or_network'
              ? 'TLS'
              : r.kind === 'redirect_loop'
                ? 'REDIR'
                : 'FAIL';
  const curlNote = r.viaCurl ? ' (curl)' : '';
  const line = `${tag.padEnd(6)} ${r.status ?? '---'} ${url}${curlNote}${r.error ? ` (${r.error})` : ''}`;
  console.log(line);
}

const forbidden = rows.filter((r) => r.kind === 'forbidden');
const broken = rows.filter((r) => r.kind === 'broken');
const tls = rows.filter((r) => r.kind === 'tls_or_network');
const redirects = rows.filter((r) => r.kind === 'redirect_loop');
const okCurl = rows.filter((r) => r.kind === 'ok_curl');
console.log('');
console.log(
  `Summary: ${rows.length} URLs — ${rows.filter((r) => r.ok).length} OK (${okCurl.length} via curl fallback), ${forbidden.length} HTTP 403 (open in browser if needed), ${broken.length} hard 404/5xx, ${tls.length} TLS/network, ${redirects.length} redirect loop`
);
process.exitCode = broken.length ? 1 : 0;
