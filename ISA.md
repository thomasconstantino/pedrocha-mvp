---
project: PedroCha-MVP
task: Build a deployable MVP real-estate operations dashboard for Pedro's Alentejo property operation
effort: E4
phase: observe
progress: 0/34
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
- [ ] ISC-1: `src/data/properties.json` exists and contains exactly 20 listings
- [ ] ISC-2: Every listing has a real, non-empty `url` to a Portuguese portal
- [ ] ISC-3: Every listing has `estado: "ativo"` (all active)
- [ ] ISC-4: Every listing has numeric `preco_eur` and `area_m2` > 0
- [ ] ISC-5: Every listing has `preco_por_m2` equal to round(preco_eur/area_m2) within tolerance
- [ ] ISC-6: Listings span the Vidigueira/Beja region (concelho field within allowed set)
- [ ] ISC-7: `/imoveis` page renders all 20 listings (count visible in DOM)
- [ ] ISC-8: Dashboard overview shows "20 / 20 imóveis ativos" KPI
- [ ] ISC-9: Anti: no listing contains a fabricated/placeholder URL (no example.com, no #)

### Deliverable 2 — Acquisition alert system (configured + tested)
- [ ] ISC-10: `src/data/criterios-aquisicao.json` defines explicit criteria (max preço, max €/m², min área, concelhos-alvo, tipologias)
- [ ] ISC-11: `src/lib/alertas.ts` exports a pure `avaliarImovel(imovel, criterios)` returning match + reasons
- [ ] ISC-12: Engine produces per-property reasons (which criteria passed/failed)
- [ ] ISC-13: `bun test` runs and the alert-engine test suite passes
- [ ] ISC-14: Tests cover: a clear match, a clear non-match, and a boundary/edge case
- [ ] ISC-15: `/alertas` page lists every property that triggers an acquisition alert
- [ ] ISC-16: Overview shows an "Alertas de aquisição" KPI with the live count
- [ ] ISC-17: Anti: the alert engine contains NO proprietary scoring/yield model — plain criteria only

### Deliverable 3 — 5+ hours/week saved
- [ ] ISC-18: `src/data/poupanca-tempo.json` itemizes manual tasks now automated, with hours each
- [ ] ISC-19: The itemized hours sum to ≥ 5.0 hours/week
- [ ] ISC-20: `/` overview renders a "Tempo poupado" panel showing the total ≥5h/semana
- [ ] ISC-21: Panel breaks the total down by task (monitorização, faturas, relatórios, etc.)
- [ ] ISC-22: The displayed total is computed from the data, not a hardcoded string

### Deliverable 4 — Construction invoices captured per cost center
- [ ] ISC-23: `src/data/projetos.json` defines ≥3 renovation projects, each linked to a property
- [ ] ISC-24: Each project has a cost center with ≥2 construction invoices
- [ ] ISC-25: A real PDF file exists on disk for every invoice (under public/faturas/{projeto}/)
- [ ] ISC-26: Each invoice PDF is a valid PDF (starts with %PDF header)
- [ ] ISC-27: PDFs contain Portuguese fatura fields (fornecedor, NIF, descrição, valor, IVA, data)
- [ ] ISC-28: `/centros-custo` page lists each project, its invoices, budget vs spent, and links to each PDF
- [ ] ISC-29: Each captured invoice shows a "via WhatsApp" capture badge (mocked)
- [ ] ISC-30: Anti: no real WhatsApp API/webhook/credential exists anywhere in the codebase

### Cross-cutting — build, deploy, language
- [ ] ISC-31: `bun run build` completes with zero errors and emits `dist/`
- [ ] ISC-32: UI chrome is in PT-PT (nav labels: Imóveis, Alertas, Centros de Custo, Critérios)
- [ ] ISC-33: Site is deployed to a public URL returning HTTP 200
- [ ] ISC-34: Live URL screenshot/curl confirms the overview renders with the 4 KPIs

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

(entries appended at LEARN)

## Verification

(evidence appended at VERIFY)
