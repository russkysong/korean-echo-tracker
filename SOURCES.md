# Source QA Table

Last checked: 2026-04-15 — run `npm run verify-sources` for automated HTTP checks (Referer + Accept-Language; **curl** fallback). Exit **0** = no hard **404/5xx**.

## Optional third-party reference (not in app UI)

| Site | URL | Notes |
|------|-----|--------|
| V for Korea | https://vforkorea.com/ | Third-party editorial timeline — **not** endorsed by the dataset. Remove this row if you do not want it documented. |

**AI Basic Act (ai-1 & fake-news-1 `koreanSource`):** `https://www.law.go.kr/lsInfoP.do?lsId=014820`

| id | claim | URL | type | status |
|---|---|---|---|---|
| cbdc-1 | Atlantic Council CBDC tracker | https://www.atlanticcouncil.org/cbdctracker/ | globalSource | ✅ auto |
| cbdc-1 | BOK Hangang / CBDC portal | https://www.bok.or.kr/portal/submain/submain/cbdc.do?menuNo=201136 | koreanSource | ✅ auto — BOK menus can change |
| ai-1 | EU AI Act (consolidated) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689 | globalSource | ✅ auto |
| ai-1 | Korea AI Basic Act | https://www.law.go.kr/lsInfoP.do?lsId=014820 | koreanSource | ✅ auto |
| digitalid-1 | World Bank — DPI topic | https://www.worldbank.org/ext/en/topic/digital-and-ai/digital-public-infrastructure-and-services | globalSource | ✅ auto |
| digitalid-1 | MOIS | https://www.mois.go.kr/ | koreanSource | ✅ auto — deepen to mobile ID page if needed |
| esg-1 | Paris Agreement (UNFCCC) | https://unfccc.int/process-and-meetings/the-paris-agreement | globalSource | ✅ auto |
| esg-1 | law.go.kr search hub | https://www.law.go.kr/ | koreanSource | ⚠️ homepage — deepen for 탄소중립기본법 when stable |
| detention-1 | Global Compact on Refugees (UNHCR hub) | https://www.unhcr.org/international/global-compact-refugees | globalSource | ⚠️ **WAF** — may still be **403** in `verify-sources` (same bot policy as PDF); OK in browser |
| detention-1 | Constitutional Court | https://www.ccourt.go.kr/ | koreanSource | ✅ auto — deepen to a decision URL when pinned |
| soft-power-1 | MCST (K-content / policy) | https://www.mcst.go.kr/ | globalSource | ✅ auto (replaces OECD tourism; better fit) |
| soft-power-1 | MCST | https://www.mcst.go.kr/ | koreanSource | ✅ same |

## Manual browser confirmations (5 + optional PDF)

Automation often gets **403** on these; that does **not** mean the URL is wrong. Open each in a normal browser **once**, confirm the page loads, then add a dated line under the template below. (Do not record “confirmed” until you have actually opened the link.)

| # | URL | Used in |
|---|-----|---------|
| 1 | https://www.ohchr.org/en/freedom-of-expression | fake-news-1 `globalSource` |
| 2 | https://www.ohchr.org/en/hr-bodies/upr/upr-republic-of-korea-stakeholder-info-s14 | matrix-korea-proof (UPR stakeholder hub) |
| 3 | https://www.ohchr.org/en/state/korea-republic | matrix-korea-proof (country page) |
| 4 | https://www.refworld.org/jurisprudence/caselaw/korcc/2023/ko/149907 | matrix-korea-proof (Refworld case page — not the refworld.org homepage) |
| 5 | https://www.unhcr.org/international/global-compact-refugees | detention-1 `globalSource` (UNHCR HTML hub) |

**Optional sixth (canonical PDF text):** https://www.unhcr.org/gcr/GCR_English.pdf — same WAF pattern as the HTML hub.

**Template — paste and fill after you confirm:**

```text
## Confirmed in browser
Date: YYYY-MM-DD
- (1) OHCHR freedom of expression — OK
- (2) OHCHR UPR ROK stakeholder — OK
- (3) OHCHR Korea state page — OK
- (4) Refworld jurisprudence URL — OK
- (5) UNHCR GCR hub — OK
- (optional) UNHCR GCR PDF — OK
```

## MOJ links in `matrix-korea-proof.ts` (redirect loop in automation)

**What they are:** Row 3 (“Policy networks”) cites the **Ministry of Justice** as an institutional source for immigration/refugee policy — **not** a specific court judgment or statute clause. The links are generic entry points:

- EN: `https://www.moj.go.kr/english/`
- KO: `https://www.moj.go.kr`

**Why automation fails:** both paths can **307-loop** without a browser cookie session — a WAF / load-balancer pattern, not necessarily a broken public URL.

**Should you replace them?** Only if you find a **stable `go.kr` content URL** (e.g. a permanent bulletin or organization chart page) that you are willing to maintain. Using the **ministry root** is intentionally generic; swapping to a deep link that moves after a site redesign can be worse than the homepage.

**Practical default:** keep as-is; open from a **fresh browser tab** or search **법무부** if the direct link misbehaves.

## Notes

- **detention-1**: `globalSource` is the UNHCR **HTML** hub (better for clicking than PDF). Automated checks may still see **403** on `unhcr.org` — not a bad link. Use the **GCR PDF** line above for the canonical document when citing.
- **Non-URL `globalSource` strings**: removed — `ai-1`, `digitalid-1`, `esg-1`, `detention-1`, and `soft-power-1` now use HTTPS URLs above.
- **Korean homepages**: several `koreanSource` values are ministry homepages; optional future improvement is deep links to the exact notice or statute.
- **sourceVerified**: edit in Research Station if you change verification flags after manual review.
