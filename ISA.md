---
project: PedroCha-MVP
task: Build a deployable MVP real-estate operations dashboard for Pedro's Alentejo property operation
effort: E4
phase: complete
progress: 34/34
mode: build
started: 2026-06-29
updated: 2026-06-29
---

# PedroCha MVP — Real-Estate Operations Dashboard

> **Scope note (read first).** This is a *deliberately reduced* MVP intended for an intermediary/financier. It demonstrates operational capability without exposing the project's unique advantage — the proprietary acquisition-scoring insight and the off-market sourcing edge are **out of scope by design**. The alert engine here uses ordinary, visible criteria (price, €/m², area, location, typology) — not the real edge.

## Problem

Pedro runs a property-acquisition-and-renovation operation in the Vidigueira / Beja region of the Alentejo. Today his operational management is manual: he monitors property portals by hand for acquisition opportunities, tracks renovation ("obra") invoices that arrive over WhatsApp by hand, and has no single view of his active portfolio. He needs a single dashboard to show a financier that the operation is real, instrumented, and efficient — and that the operation can be financed with confidence.

## Vision

A clean, Portuguese-language dashboard the intermediary can open from a public URL and immediately understand: every active property is on screen, an alert system flags which properties meet the operation's acquisition criteria, the renovation cost-centers show construction invoices already captured, and a headline figure proves the system gives Pedro back 5+ hours every week. It should feel like a real operations cockpit, not a slide deck — and crucially, it should be convincing without revealing *why* Pedro's deals are good (the secret sauce stays out).

## Out of Scope

- **The unique advantage.** No proprietary acquisition-scoring algorithm, no off-market sourcing logic, no yield-prediction model, no negotiation playbook. The alert engine uses only plain, visible criteria. This is the single most important exclusion.
- **Real WhatsApp integration.** No WhatsApp Business API, no message ingestion, no webhook. Invoices are represented by pre-generated mock PDF receipts placed in each cost center, shown with a (mocked) "via WhatsApp" capture badge.
- **A real scraper.** No live scraping pipeline. The 20 listings are real ads sourced once, by hand/agent, from public Portuguese portals and frozen into a static dataset.
- Authentication / multi-user / RBAC. Single public read-only demo.
- A backend / database. Static Astro site over JSON data files.

## Principles

- **Honesty over theatre.** Every number on the dashboard must trace to data in the repo. The 5h/week figure is an itemized model, not a vibe. Listings are real with real source URLs.
- **Withhold the edge.** Demonstrating capability ≠ revealing method. The MVP proves *that* it works, never *why* it works better than the market.
- **Deterministic data.** All figures derive from committed JSON; no runtime randomness.

## Constraints

- Stack: **Astro + Tailwind + TypeScript**, package manager **bun** (never npm/npx). Matches the existing Graphcore-RealEstate-Dashboard house style.
- UI language: **European Portuguese (PT-PT)**.
- Must build to static output and deploy to a **public host** with a live URL.
- No hardcoded absolute paths in code.

## Goal

Ship a deployed, publicly-reachable Astro dashboard (PT-PT) that proves four things with in-repo evidence: (1) 100% of the 20 real active Vidigueira/Beja properties are loaded and visible; (2) a configured, unit-tested acquisition-alert engine flags matching properties; (3) an itemized panel demonstrates ≥5 hours/week of operational time returned to Pedro; (4) every renovation project's cost center shows its construction invoices auto-"captured" as mock PDFs — with no real WhatsApp and no scraper built.

## Criteria

### Deliverable 1 — Properties loaded & visible
- [x] ISC-1: `src/data/properties.json` exists and contains exactly 20 listings
- [x] ISC-2: Every listing has a real, non-empty `url` to a Portuguese portal
- [x] ISC-3: Every listing has `estado: "ativo"` (all active)
- [x] ISC-4: Every listing has numeric `preco_eur` and `area_m2` > 0
- [x] ISC-5: Every listing has `preco_por_m2` equal to round(preco_eur/area_m2) within tolerance
- [x] ISC-6: Listings span the Vidigueira/Beja region (concelho field within allowed set)
- [x] ISC-7: `/imoveis` page renders all 20 listings (count visible in DOM)
- [x] ISC-8: Dashboard overview shows "20 / 20 imóveis ativos" KPI
- [x] ISC-9: Anti: no listing contains a fabricated/placeholder URL (no example.com, no #)

### Deliverable 2 — Acquisition alert system (configured + tested)
- [x] ISC-10: `src/data/criterios-aquisicao.json` defines explicit criteria (max preço, max €/m², min área, concelhos-alvo, tipologias)
- [x] ISC-11: `src/lib/alertas.ts` exports a pure `avaliarImovel(imovel, criterios)` returning match + reasons
- [x] ISC-12: Engine produces per-property reasons (which criteria passed/failed)
- [x] ISC-13: `bun test` runs and the alert-engine test suite passes
- [x] ISC-14: Tests cover: a clear match, a clear non-match, and a boundary/edge case
- [x] ISC-15: `/alertas` page lists every property that triggers an acquisition alert
- [x] ISC-16: Overview shows an "Alertas de aquisição" KPI with the live count
- [x] ISC-17: Anti: the alert engine contains NO proprietary scoring/yield model — plain criteria only

### Deliverable 3 — 5+ hours/week saved
- [x] ISC-18: `src/data/poupanca-tempo.json` itemizes manual tasks now automated, with hours each
- [x] ISC-19: The itemized hours sum to ≥ 5.0 hours/week
- [x] ISC-20: `/` overview renders a "Tempo poupado" panel showing the total ≥5h/semana
- [x] ISC-21: Panel breaks the total down by task (monitorização, faturas, relatórios, etc.)
- [x] ISC-22: The displayed total is computed from the data, not a hardcoded string

### Deliverable 4 — Construction invoices captured per cost center
- [x] ISC-23: `src/data/projetos.json` defines ≥3 renovation projects, each linked to a property
- [x] ISC-24: Each project has a cost center with ≥2 construction invoices
- [x] ISC-25: A real PDF file exists on disk for every invoice (under public/faturas/{projeto}/)
- [x] ISC-26: Each invoice PDF is a valid PDF (starts with %PDF header)
- [x] ISC-27: PDFs contain Portuguese fatura fields (fornecedor, NIF, descrição, valor, IVA, data)
- [x] ISC-28: `/centros-custo` page lists each project, its invoices, budget vs spent, and links to each PDF
- [x] ISC-29: Each captured invoice shows a "via WhatsApp" capture badge (mocked)
- [x] ISC-30: Anti: no real WhatsApp API/webhook/credential exists anywhere in the codebase

### Cross-cutting — build, deploy, language
- [x] ISC-31: `bun run build` completes with zero errors and emits `dist/`
- [x] ISC-32: UI chrome is in PT-PT (nav labels: Imóveis, Alertas, Centros de Custo, Critérios)
- [x] ISC-33: Site is deployed to a public URL returning HTTP 200
- [x] ISC-34: Live URL screenshot/curl confirms the overview renders with the 4 KPIs

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | data | count listings | ==20 | Bash jq |
| ISC-2,9 | data | url regex, no placeholders | 100% | Bash grep |
| ISC-5 | data | recompute €/m² | ±2 | Bash node |
| ISC-13,14 | test | bun test green | pass | bun test |
| ISC-19 | data | sum hours | ≥5.0 | Bash jq |
| ISC-25,26 | file | %PDF header present | all | Bash |
| ISC-31 | build | build exit 0 | 0 | bun run build |
| ISC-33,34 | deploy | curl live URL | 200 | curl/Interceptor |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| Astro scaffold + layout | ISC-32 | — | no |
| Listings dataset (real) | ISC-1..9 | research agents | yes (agents) |
| Alert engine + tests | ISC-10..17 | listings | yes |
| Time-saved model | ISC-18..22 | — | yes |
| Cost centers + PDF gen | ISC-23..30 | projetos linked to listings | yes |
| Dashboard pages | ISC-7,8,15,16,20,21,28,29 | all data | no |
| Build + deploy | ISC-31,33,34 | dashboard | no |

## Decisions

- 2026-06-29: Stack/language/delivery chosen by user via AskUserQuestion — Astro+Tailwind, PT-PT, deployed+hosted.
- 2026-06-29: Classifier returned E4; honored. Project has persistent identity → ISA lives at project root, not MEMORY/WORK.
- 2026-06-29: Listings sourced by 2 parallel background research agents (real URLs only) rather than a built scraper, per explicit constraint.
- 2026-06-29: "via WhatsApp" capture is a static badge over pre-generated PDFs — no API. Anti-criterion ISC-30 guards this.
- 2026-06-29: Acquisition edge withheld — alert engine uses only plain visible criteria. Anti-criterion ISC-17 guards this.

## Changelog

- conjectured: hosted deploy would require Cloudflare/Vercel credentials + Node 22 (wrangler). refuted_by: the advisor (external GPT-class model via Inference.ts) noting the Astro output is **static**, so no adapter/wrangler is needed at all. learned: a static build deploys to any static host; `gh` (already authenticated) made GitHub Pages a fully autonomous, self-verifiable path. criterion_now: ISC-33/34 verified live, not deferred.
- conjectured: integer-rounded areas were fine. refuted_by: ISC-5 recompute flagged imv-08 (area 144 vs source 143.5 → €/m² mismatch). learned: keep source-faithful area values; recompute-probe catches silent data drift. criterion_now: ISC-5 passes with 0 rows off.

## Verification

**Deliverable 1 — Properties (ISC-1..9):** `grep -c imv- imoveis.json` = 20; live `/imoveis/` `data-imovel` rows = 20; all `estado: "ativo"`; every `url` is a real imovirtual.com listing (no placeholders); €/m² recompute = 0 rows off after imv-08 fix; concelhos ∈ {Vidigueira, Cuba, Alvito, Beja, Ferreira do Alentejo}; overview KPI "20 / 20" confirmed live.
**Deliverable 2 — Alerts (ISC-10..17):** `bun test` → 8 pass / 0 fail (match, non-match price, non-match concelho, non-match type, boundary-equal, area-edge); live `/alertas/` shows 8 "Alerta de aquisição" badges; overview "Alertas de aquisição" KPI present; engine is plain criteria only (no proprietary scoring).
**Deliverable 3 — Time saved (ISC-18..22):** `poupanca-tempo.json` 4 itemized tasks summing to 5.25 h (computed via reduce, not hardcoded); overview panel renders "5,25 h" + per-task breakdown live.
**Deliverable 4 — Invoices (ISC-23..30):** 3 projects (imv-01/02/03), 7 invoices total (3/2/2), 7 PDFs on disk all `%PDF`; live PDF serves `200 application/pdf`; `/centros-custo/` shows 7 "via WhatsApp" badges + budget/spent + PDF links; grep confirms NO real WhatsApp API/webhook/credential.
**Cross-cutting (ISC-31..34):** `astro build` exit 0 → dist/; nav labels PT-PT; **live at https://thomasconstantino.github.io/pedrocha-mvp/ → HTTP 200**, CSS asset 200, all 4 sub-routes 200.

**Doctrine notes:** Advisor (Rule 2) called once at the commitment boundary — surfaced the static-build insight, the "don't call it done" reframe, and the mock-labeling check (all actioned). **Cato (Rule 2a, E4-mandatory) could NOT run — `codex` CLI is not installed on this machine.** Show-your-math: the cross-vendor blind-spot function was partially served by the GPT-class advisor (a non-Anthropic model), which did catch real issues; a follow-up Cato pass is recommended if codex is installed later.
