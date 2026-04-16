import { unstable_cache } from 'next/cache';
import { patterns as echoPatterns } from '@/lib/patterns';
import type { Pattern } from '@/lib/patterns';
import {
  fetchMolegOgLmPpPage,
  isMolegUnauthorizedXml,
  mergeKoEnMolegMatches,
  searchMolegNoticesWithTriggers,
  type MolegNoticeMatch,
} from '@/lib/lawmaking-api';

/**
 * Echo pattern rows for the /assembly monitor.
 * Data source: 법제처 정부 입법예고 (국민참여입법센터 REST XML ogLmPp), not 국회 의안 Open API.
 */

export interface AssemblyBill {
  billId: string;
  billName: string;
  proposer: string;
  committee: string;
  proposedDate: string;
  status: string;
  detailUrl: string;
}

export interface AssemblyBillMatch extends AssemblyBill {
  /** Which search keyword(s) returned this row for the current pattern. */
  triggerKeywords: string[];
}

export interface PatternMatchResult {
  patternId: string;
  topic: string;
  agendaTags: string[];
  matchedKeywords: string[];
  bills: AssemblyBillMatch[];
  totalCount: number;
}

export type AssemblyApiError = 'rate_limit' | 'invalid_key' | 'api_error' | 'network';

/** `api` = live rows from lawmaking.go.kr ogLmPp XML. `pal_only` = no OC; Echo keywords + gcom links only. */
export type AssemblyDataMode = 'api' | 'pal_only';

export interface AssemblyMonitorState {
  results: PatternMatchResult[];
  fetchedAtIso: string;
  totalBillsUnique: number;
  totalBillRows: number;
  dataMode: AssemblyDataMode;
  apiError: AssemblyApiError | null;
  apiMessage: string | null;
  stale: boolean;
}

function hasHangul(s: string): boolean {
  return /[\uAC00-\uD7AF]/.test(s);
}

function partitionKeywords(keywords: string[]): { ko: string[]; en: string[] } {
  const ko: string[] = [];
  const en: string[] = [];
  const seenKo = new Set<string>();
  const seenEn = new Set<string>();
  for (const raw of keywords) {
    const k = raw.trim();
    if (k.length < 2) continue;
    if (hasHangul(k)) {
      if (!seenKo.has(k)) {
        seenKo.add(k);
        ko.push(k);
      }
    } else if (!seenEn.has(k)) {
      seenEn.add(k);
      en.push(k);
    }
  }
  return { ko, en };
}

const MAX_KEYWORDS_PER_PATTERN = 14;

function collectPatternKeywords(p: Pattern): string[] {
  const raw = [...p.relatedKeywords, ...(p.searchAliases ?? []), p.topic];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    const t = r.trim();
    if (t.length < 2 || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= MAX_KEYWORDS_PER_PATTERN) break;
  }
  return out;
}

function molegToAssemblyMatch(m: MolegNoticeMatch): AssemblyBillMatch {
  return {
    billId: m.billId,
    billName: m.billName,
    proposer: m.proposer,
    committee: m.committee,
    proposedDate: m.proposedDate,
    status: m.status,
    detailUrl: m.detailUrl,
    triggerKeywords: m.triggerKeywords,
  };
}

async function searchNoticesWithTriggers(keywords: string[], oc: string): Promise<AssemblyBillMatch[]> {
  const rows = await searchMolegNoticesWithTriggers(keywords, oc);
  return rows.map(molegToAssemblyMatch);
}

function mergeKoEnMatches(a: AssemblyBillMatch[], b: AssemblyBillMatch[]): AssemblyBillMatch[] {
  const mk = (x: AssemblyBillMatch): MolegNoticeMatch => ({
    billId: x.billId,
    billName: x.billName,
    proposer: x.proposer,
    committee: x.committee,
    proposedDate: x.proposedDate,
    status: x.status,
    detailUrl: x.detailUrl,
    triggerKeywords: x.triggerKeywords,
  });
  const merged = mergeKoEnMolegMatches(a.map(mk), b.map(mk));
  return merged.map(molegToAssemblyMatch);
}

export async function searchBillsByKeywords(keywords: string[], oc: string): Promise<AssemblyBill[]> {
  try {
    const m = await searchNoticesWithTriggers(keywords, oc);
    return m.map(({ triggerKeywords: _t, ...bill }) => bill);
  } catch {
    return [];
  }
}

export async function getPatternMatches(patterns: Pattern[], oc: string): Promise<PatternMatchResult[]> {
  const trimmedOc = oc.trim();
  const out: PatternMatchResult[] = [];

  for (const p of patterns) {
    const allKw = collectPatternKeywords(p);
    const { ko, en } = partitionKeywords(allKw);

    const koMatches = await searchNoticesWithTriggers(ko, trimmedOc);
    const enMatches = await searchNoticesWithTriggers(en, trimmedOc);
    const bills = mergeKoEnMatches(koMatches, enMatches);

    const matchedKeywords = [...new Set(bills.flatMap((b) => b.triggerKeywords))];

    out.push({
      patternId: p.id,
      topic: p.topic,
      agendaTags: p.agendaTags,
      matchedKeywords,
      bills,
      totalCount: bills.length,
    });
  }

  out.sort((a, b) => b.totalCount - a.totalCount);
  return out;
}

/** No OC: Echo keywords + 국민참여입법센터 gcom search links (browser only). */
function linkOnlyPatternRows(patterns: Pattern[]): PatternMatchResult[] {
  const rows = patterns.map((p) => ({
    patternId: p.id,
    topic: p.topic,
    agendaTags: p.agendaTags,
    matchedKeywords: collectPatternKeywords(p),
    bills: [] as AssemblyBillMatch[],
    totalCount: 0,
  }));
  rows.sort((a, b) => a.topic.localeCompare(b.topic, 'en'));
  return rows;
}

async function loadAssemblyMonitorStateUncached(patterns: Pattern[]): Promise<AssemblyMonitorState> {
  const fetchedAtIso = new Date().toISOString();
  const oc = process.env.LAWMAKING_OC?.trim() ?? '';

  if (!oc) {
    return {
      results: linkOnlyPatternRows(patterns),
      fetchedAtIso,
      totalBillsUnique: 0,
      totalBillRows: 0,
      dataMode: 'pal_only',
      apiError: null,
      apiMessage: null,
      stale: false,
    };
  }

  try {
    const probe = await fetchMolegOgLmPpPage(oc, '법');
    if (probe.status === 429) {
      return {
        results: linkOnlyPatternRows(patterns),
        fetchedAtIso,
        totalBillsUnique: 0,
        totalBillRows: 0,
        dataMode: 'pal_only',
        apiError: 'rate_limit',
        apiMessage: '429 Too Many Requests',
        stale: true,
      };
    }

    if (isMolegUnauthorizedXml(probe.xml)) {
      return {
        results: linkOnlyPatternRows(patterns),
        fetchedAtIso,
        totalBillsUnique: 0,
        totalBillRows: 0,
        dataMode: 'pal_only',
        apiError: 'invalid_key',
        apiMessage: 'OC rejected (retMsg 401)',
        stale: false,
      };
    }

    const results = await getPatternMatches(patterns, oc);

    const idSet = new Set<string>();
    let rows = 0;
    for (const r of results) {
      rows += r.bills.length;
      for (const b of r.bills) idSet.add(b.billId || b.billName);
    }

    return {
      results,
      fetchedAtIso,
      totalBillsUnique: idSet.size,
      totalBillRows: rows,
      dataMode: 'api',
      apiError: null,
      apiMessage: null,
      stale: false,
    };
  } catch (e) {
    return {
      results: linkOnlyPatternRows(patterns),
      fetchedAtIso,
      totalBillsUnique: 0,
      totalBillRows: 0,
      dataMode: 'pal_only',
      apiError: 'network',
      apiMessage: e instanceof Error ? e.message : 'unknown',
      stale: true,
    };
  }
}

/** Cached 1h; bust with `revalidateAssemblyMonitor()` server action. */
export const loadAssemblyMonitorState = unstable_cache(
  async () => loadAssemblyMonitorStateUncached(echoPatterns),
  ['assembly-monitor', String(echoPatterns.length)],
  { revalidate: 3600, tags: ['assembly-monitor'] }
);
