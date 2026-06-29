// Renderizadores client-side partilhados, para recalcular alertas no browser
// quando os critérios são editados. Devem espelhar o markup SSR das páginas.
import { eur, m2 } from './formato';
import type { AvaliacaoImovel } from './tipos';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderAlertaCard(av: AvaliacaoImovel): string {
  const i = av.imovel;
  const razoes = av.razoes
    .map(
      (r) => `
      <div class="rounded-lg px-3 py-2 text-xs ${r.cumpre ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}">
        <div class="font-semibold flex items-center gap-1"><span>${r.cumpre ? '✓' : '✗'}</span> ${esc(r.criterio)}</div>
        <div class="text-[11px] opacity-80 mt-0.5">${esc(r.detalhe)}</div>
      </div>`,
    )
    .join('');
  return `
    <div class="bg-white rounded-xl border border-terra-100 p-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full bg-azul-700 text-white text-[10px]">Alerta de aquisição</span>
            <span class="text-xs text-gray-500">${esc(i.id)}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mt-1">${esc(i.titulo)}</h3>
          <div class="text-sm text-gray-500">${esc(i.localidade)}, ${esc(i.concelho)} · ${esc(i.tipologia)}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xl font-bold text-terra-700">${eur(i.preco_eur)}</div>
          <div class="text-xs text-gray-500">${eur(i.preco_por_m2)}/m² · ${m2(i.area_m2)}</div>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">${razoes}</div>
      <div class="mt-3">
        <a href="${esc(i.url)}" target="_blank" rel="noopener" class="text-azul-700 hover:underline text-xs">ver anúncio original →</a>
      </div>
    </div>`;
}

export function renderDestaqueRow(av: AvaliacaoImovel): string {
  const i = av.imovel;
  return `
    <div class="py-3 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <div class="font-medium text-gray-900 truncate">${esc(i.titulo)}</div>
        <div class="text-xs text-gray-500">${esc(i.localidade)}, ${esc(i.concelho)}</div>
      </div>
      <div class="text-right shrink-0">
        <div class="font-bold text-terra-700">${eur(i.preco_eur)}</div>
        <div class="text-xs text-gray-500">${eur(i.preco_por_m2)}/m²</div>
      </div>
    </div>`;
}

export function chipsCriterios(r: {
  preco_max_eur: number;
  preco_por_m2_max_eur: number;
  area_min_m2: number;
  concelhos_alvo: string[];
  tipos_alvo: string[];
}): string {
  const chip = (t: string) => `<span class="bg-white/15 rounded-full px-3 py-1">${esc(t)}</span>`;
  return [
    chip(`Preço ≤ ${eur(r.preco_max_eur)}`),
    chip(`≤ ${eur(r.preco_por_m2_max_eur)}/m²`),
    chip(`Área ≥ ${r.area_min_m2} m²`),
    chip(`Concelhos: ${r.concelhos_alvo.join(', ')}`),
    chip(`Tipos: ${r.tipos_alvo.join(', ')}`),
  ].join('');
}
