import type {
  Imovel,
  Criterios,
  CriteriosRegras,
  AvaliacaoImovel,
  RazaoCriterio,
} from './tipos';

/**
 * Motor de alertas de aquisição (MVP).
 *
 * Função pura: avalia um imóvel face aos critérios operacionais visíveis.
 * NÃO contém qualquer modelo de avaliação proprietário (scoring de yield,
 * sourcing off-market, etc.) — apenas filtros simples e auditáveis.
 *
 * Um imóvel gera ALERTA quando cumpre TODOS os critérios.
 */
export function avaliarImovel(imovel: Imovel, regras: CriteriosRegras): AvaliacaoImovel {
  const razoes: RazaoCriterio[] = [
    {
      criterio: 'Preço',
      cumpre: imovel.preco_eur <= regras.preco_max_eur,
      detalhe: `${fmtEur(imovel.preco_eur)} (máx. ${fmtEur(regras.preco_max_eur)})`,
    },
    {
      criterio: 'Preço por m²',
      cumpre: imovel.preco_por_m2 <= regras.preco_por_m2_max_eur,
      detalhe: `${fmtEur(imovel.preco_por_m2)}/m² (máx. ${fmtEur(regras.preco_por_m2_max_eur)}/m²)`,
    },
    {
      criterio: 'Área',
      cumpre: imovel.area_m2 >= regras.area_min_m2,
      detalhe: `${imovel.area_m2} m² (mín. ${regras.area_min_m2} m²)`,
    },
    {
      criterio: 'Concelho-alvo',
      cumpre: regras.concelhos_alvo.includes(imovel.concelho),
      detalhe: imovel.concelho,
    },
    {
      criterio: 'Tipo-alvo',
      cumpre: regras.tipos_alvo.includes(imovel.tipo),
      detalhe: imovel.tipo,
    },
  ];

  const razoes_falhadas = razoes.filter((r) => !r.cumpre).map((r) => r.criterio);
  const alerta = razoes_falhadas.length === 0;

  return { imovel, alerta, razoes, razoes_falhadas };
}

/** Avalia todos os imóveis e devolve apenas os que geram alerta. */
export function imoveisComAlerta(imoveis: Imovel[], criterios: Criterios): AvaliacaoImovel[] {
  return imoveis
    .map((i) => avaliarImovel(i, criterios.regras))
    .filter((a) => a.alerta);
}

/** Avalia todos os imóveis e devolve todas as avaliações (com e sem alerta). */
export function avaliarTodos(imoveis: Imovel[], criterios: Criterios): AvaliacaoImovel[] {
  return imoveis.map((i) => avaliarImovel(i, criterios.regras));
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}
