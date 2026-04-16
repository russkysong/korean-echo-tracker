import { XMLParser } from 'fast-xml-parser';

/**
 * 법제처 / 국민참여입법센터 — 정부 입법예고 목록 REST (XML).
 * Docs: https://www.lawmaking.go.kr/rest/ogLmPp (redirects to opinion.lawmaking.go.kr)
 * OC = 정보공개 신청 ID의 @ 앞부분 (data.go.kr 연동 계정과 동일 체계).
 */

export const LAWMAKING_GCOM_OGLMPP = 'https://opinion.lawmaking.go.kr/gcom/ogLmPp';

const DEFAULT_REST_LIST = 'https://opinion.lawmaking.go.kr/rest/ogLmPp.xml';

const REQUEST_DELAY_MS = 350;
const MAX_KEYWORDS = 14;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

export function lawmakingListUrl(): string {
  return (process.env.LAWMAKING_REST_URL?.trim() || DEFAULT_REST_LIST).replace(/\/$/, '');
}

export function molegGcomKeywordUrl(keyword: string): string {
  const u = new URL(LAWMAKING_GCOM_OGLMPP);
  u.searchParams.set('lsNm', keyword);
  return u.toString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function pick(row: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

/** Same field names as AssemblyBill in assembly-api (shared UI row). */
export interface MolegNoticeRow {
  billId: string;
  billName: string;
  proposer: string;
  committee: string;
  proposedDate: string;
  status: string;
  detailUrl: string;
}

export interface MolegNoticeMatch extends MolegNoticeRow {
  triggerKeywords: string[];
}

function collectOgLmPpNodes(node: unknown, out: Record<string, unknown>[]): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const x of node) collectOgLmPpNodes(x, out);
    return;
  }
  if (typeof node !== 'object') return;
  const o = node as Record<string, unknown>;
  const lsNm = o.lsNm ?? o.LS_NM;
  const seq = o.ogLmPpSeq ?? o.OG_LM_PP_SEQ;
  if (typeof lsNm === 'string' && lsNm.length > 0 && seq != null && String(seq).trim() !== '') {
    out.push(o);
    return;
  }
  for (const v of Object.values(o)) collectOgLmPpNodes(v, out);
}

function parseOgLmPpXml(xml: string): Record<string, unknown>[] {
  const trimmed = xml.trim();
  if (!trimmed) return [];
  if (/<retMsg>\s*401\s*<\/retMsg>/i.test(trimmed)) return [];

  let parsed: unknown;
  try {
    parsed = xmlParser.parse(trimmed);
  } catch {
    return [];
  }

  const rows: Record<string, unknown>[] = [];
  collectOgLmPpNodes(parsed, rows);
  return rows;
}

function normalizeMolegRow(row: Record<string, unknown>): MolegNoticeRow | null {
  const billName = pick(row, ['lsNm', 'LS_NM']);
  if (!billName) return null;

  const seq = pick(row, ['ogLmPpSeq', 'OG_LM_PP_SEQ']);
  const mapping = pick(row, ['mappingLbicId', 'mappingLbicID', 'MAPPING_LBIC_ID']);
  const annc = pick(row, ['announceType', 'anncTp', 'ANNC_TP', 'anncTpCd']) || 'TYPE5';

  const proposer = pick(row, ['asndOfiNm', 'ASND_OFI_NM', 'cptOfiOrgNm']);
  const committee = pick(row, ['lsClsNm', 'LS_CLS_NM', 'lsKndNm']);
  const proposedDate = pick(row, ['pntcDt', 'PNTC_DT', 'stYd', 'ST_YD']);
  const diff = pick(row, ['diff', 'DIFF', 'prgsStts']);

  let status = '—';
  if (diff === '0') status = '진행';
  else if (diff === '1') status = '종료';

  const id = seq || billName;

  let detailUrl = molegGcomKeywordUrl(billName);
  if (seq && mapping) {
    detailUrl = `https://opinion.lawmaking.go.kr/rest/ogLmPp/${seq}/${mapping}/${annc}.html`;
  }

  return {
    billId: id,
    billName,
    proposer,
    committee,
    proposedDate,
    status,
    detailUrl,
  };
}

export function isMolegUnauthorizedXml(xml: string): boolean {
  return /<retMsg>\s*401\s*<\/retMsg>/i.test(xml.trim());
}

export async function fetchMolegOgLmPpPage(oc: string, lsNm: string): Promise<{ status: number; xml: string }> {
  const url = new URL(lawmakingListUrl());
  url.searchParams.set('OC', oc.trim());
  url.searchParams.set('diff', '0');
  if (lsNm.trim()) url.searchParams.set('lsNm', lsNm.trim());

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/xml, text/xml', 'User-Agent': 'KoreaEchoTracker/1.0' },
    cache: 'no-store',
  });
  const xml = await res.text();
  return { status: res.status, xml };
}

async function searchMolegForKeyword(
  oc: string,
  keyword: string,
  billMap: Map<string, MolegNoticeRow>,
  triggers: Map<string, Set<string>>
): Promise<boolean> {
  const { status, xml } = await fetchMolegOgLmPpPage(oc, keyword);
  if (status === 429 || status >= 500) return false;

  if (isMolegUnauthorizedXml(xml)) return false;

  const rawRows = parseOgLmPpXml(xml);
  for (const row of rawRows) {
    const notice = normalizeMolegRow(row);
    if (!notice) continue;
    const id = notice.billId || notice.billName;
    billMap.set(id, notice);
    if (!triggers.has(id)) triggers.set(id, new Set());
    triggers.get(id)!.add(keyword);
  }
  return true;
}

function mergeTriggers(
  billMap: Map<string, MolegNoticeRow>,
  triggers: Map<string, Set<string>>
): MolegNoticeMatch[] {
  const out: MolegNoticeMatch[] = [];
  for (const [id, bill] of billMap) {
    out.push({
      ...bill,
      triggerKeywords: [...(triggers.get(id) ?? new Set())],
    });
  }
  out.sort((a, b) => (b.proposedDate || '').localeCompare(a.proposedDate || ''));
  return out;
}

export async function searchMolegNoticesWithTriggers(
  keywords: string[],
  oc: string
): Promise<MolegNoticeMatch[]> {
  const trimmed = oc.trim();
  if (!trimmed || keywords.length === 0) return [];

  const billMap = new Map<string, MolegNoticeRow>();
  const triggers = new Map<string, Set<string>>();

  try {
    const limited = keywords.slice(0, MAX_KEYWORDS);
    for (const kw of limited) {
      if (!kw.trim()) continue;
      const ok = await searchMolegForKeyword(trimmed, kw, billMap, triggers);
      if (!ok) return mergeTriggers(billMap, triggers);
      await sleep(REQUEST_DELAY_MS);
    }
  } catch {
    return mergeTriggers(billMap, triggers);
  }

  return mergeTriggers(billMap, triggers);
}

export function mergeKoEnMolegMatches(a: MolegNoticeMatch[], b: MolegNoticeMatch[]): MolegNoticeMatch[] {
  const m = new Map<string, MolegNoticeMatch>();
  for (const x of [...a, ...b]) {
    const id = x.billId || x.billName;
    const ex = m.get(id);
    if (!ex) {
      m.set(id, { ...x, triggerKeywords: [...x.triggerKeywords] });
    } else {
      const kw = new Set([...ex.triggerKeywords, ...x.triggerKeywords]);
      m.set(id, { ...ex, triggerKeywords: [...kw] });
    }
  }
  return [...m.values()].sort((x, y) => (y.proposedDate || '').localeCompare(x.proposedDate || ''));
}
