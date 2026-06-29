# PedroCha MVP — Dashboard Operacional Imobiliário

MVP (demonstração para financiamento) da operação imobiliária **PedroCha** na região
**Vidigueira / Beja** (Alentejo, Portugal). Construído em **Astro + Tailwind + TypeScript**, em Português (PT-PT).

> **Âmbito reduzido por desenho.** Este MVP demonstra a capacidade operacional **sem expor a vantagem
> única** da operação — o modelo de avaliação/sourcing proprietário fica **deliberadamente de fora**.
> O motor de alertas usa apenas critérios simples e visíveis (preço, €/m², área, concelho, tipo).

## O que demonstra

| # | Entregável | Onde |
|---|------------|------|
| 1 | **100% dos imóveis ativos** carregados e visíveis (20 anúncios reais) | `/imoveis` · KPI "20 / 20" |
| 2 | **Sistema de alerta** com critérios de aquisição configurados e **testados** | `/alertas`, `/criterios` · `bun test` |
| 3 | **≥ 5 h/semana** de tempo operacional devolvido ao Pedro (modelo itemizado) | `/` painel "Tempo poupado" (5,25 h) |
| 4 | **100% das faturas de obra** capturadas por centro de custo (PDFs) | `/centros-custo` |

### Notas de honestidade (importante)
- Os **20 imóveis são reais** — anúncios públicos do imovirtual.com, com URL de origem clicável.
- **Não há integração real de WhatsApp.** A "captura via WhatsApp" é um selo de demonstração sobre
  PDFs de faturas pré-gerados (`public/faturas/`). Não existe API/webhook/credencial de WhatsApp.
- **Não há scraper.** Os anúncios foram recolhidos uma vez e congelados em `src/data/imoveis.json`.
- Os alertas, o tempo poupado e as faturas são dados de demonstração; estão assinalados na UI.

## Desenvolvimento

```bash
bun install
bun run dev          # http://localhost:4321/pedrocha-mvp
bun test             # testa o motor de alertas (8 testes)
bun run gen:faturas  # regenera os PDFs das faturas de obra
bun run build        # gera dist/ (estático)
```

> Os scripts usam `bun --bun astro …` para correr sob o runtime do bun. Em alternativa, com Node ≥18.20.8:
> `node node_modules/astro/astro.js build`.

## Estrutura

```
src/
  data/            imoveis.json · criterios-aquisicao.json · poupanca-tempo.json · projetos.json
  lib/             alertas.ts (motor) · alertas.test.ts · tipos.ts · dados.ts · formato.ts · url.ts
  layouts/Base.astro
  pages/           index · imoveis · alertas · centros-custo · criterios
scripts/gerar-faturas.ts   gera os PDFs das faturas
public/faturas/            PDFs por centro de custo
ISA.md                     especificação/critérios (sistema de registo do projeto)
```

## Deploy

Publicado no **GitHub Pages** (site de projeto, sob `/pedrocha-mvp`):
`https://thomasconstantino.github.io/pedrocha-mvp/`

O site é **estático** — para alojar na raiz de um domínio (Cloudflare Pages, Vercel, Netlify),
remova `base` em `astro.config.mjs`, faça `bun run build` e publique a pasta `dist/`.
