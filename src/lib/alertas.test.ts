import { expect, test, describe } from 'bun:test';
import { avaliarImovel, imoveisComAlerta, avaliarTodos } from './alertas';
import type { Imovel, Criterios } from './tipos';

const criterios: Criterios = {
  nome: 'teste',
  descricao: 'teste',
  atualizado: '2026-06-29',
  regras: {
    preco_max_eur: 150000,
    preco_por_m2_max_eur: 950,
    area_min_m2: 70,
    concelhos_alvo: ['Vidigueira', 'Cuba', 'Alvito', 'Beja', 'Ferreira do Alentejo'],
    tipos_alvo: ['Moradia', 'Quinta', 'Rústico', 'Terreno'],
  },
  notas: '',
};

function imovel(over: Partial<Imovel>): Imovel {
  return {
    id: 'x',
    titulo: 'Moradia teste',
    tipologia: 'T3',
    tipo: 'Moradia',
    localidade: 'Vidigueira',
    concelho: 'Vidigueira',
    preco_eur: 100000,
    area_m2: 120,
    preco_por_m2: 833,
    descricao: '',
    fonte_site: 'imovirtual.com',
    url: 'https://www.imovirtual.com/pt/anuncio/teste-ID1',
    data_consulta: '2026-06-29',
    estado: 'ativo',
    ...over,
  };
}

describe('avaliarImovel', () => {
  test('match claro — imóvel cumpre todos os critérios → alerta', () => {
    const r = avaliarImovel(imovel({}), criterios.regras);
    expect(r.alerta).toBe(true);
    expect(r.razoes_falhadas).toHaveLength(0);
    expect(r.razoes).toHaveLength(5);
    expect(r.razoes.every((x) => x.cumpre)).toBe(true);
  });

  test('non-match claro — preço acima do máximo → sem alerta', () => {
    const r = avaliarImovel(imovel({ preco_eur: 285000, preco_por_m2: 2375 }), criterios.regras);
    expect(r.alerta).toBe(false);
    expect(r.razoes_falhadas).toContain('Preço');
    expect(r.razoes_falhadas).toContain('Preço por m²');
  });

  test('non-match — concelho fora do alvo → sem alerta', () => {
    const r = avaliarImovel(imovel({ concelho: 'Lisboa' }), criterios.regras);
    expect(r.alerta).toBe(false);
    expect(r.razoes_falhadas).toEqual(['Concelho-alvo']);
  });

  test('non-match — tipo fora do alvo (Apartamento) → sem alerta', () => {
    const r = avaliarImovel(imovel({ tipo: 'Apartamento' }), criterios.regras);
    expect(r.alerta).toBe(false);
    expect(r.razoes_falhadas).toEqual(['Tipo-alvo']);
  });

  test('edge/boundary — valores exatamente nos limites contam como cumpridos', () => {
    const r = avaliarImovel(
      imovel({ preco_eur: 150000, preco_por_m2: 950, area_m2: 70 }),
      criterios.regras,
    );
    expect(r.alerta).toBe(true);
    expect(r.razoes_falhadas).toHaveLength(0);
  });

  test('edge — área um m² abaixo do mínimo → falha apenas no critério Área', () => {
    const r = avaliarImovel(imovel({ area_m2: 69 }), criterios.regras);
    expect(r.alerta).toBe(false);
    expect(r.razoes_falhadas).toEqual(['Área']);
  });
});

describe('imoveisComAlerta / avaliarTodos', () => {
  const lista: Imovel[] = [
    imovel({ id: 'a' }), // match
    imovel({ id: 'b', preco_eur: 285000, preco_por_m2: 2375 }), // fora
    imovel({ id: 'c', concelho: 'Porto' }), // fora
  ];

  test('imoveisComAlerta devolve apenas os que geram alerta', () => {
    const alertas = imoveisComAlerta(lista, criterios);
    expect(alertas).toHaveLength(1);
    expect(alertas[0].imovel.id).toBe('a');
  });

  test('avaliarTodos devolve uma avaliação por imóvel', () => {
    const todas = avaliarTodos(lista, criterios);
    expect(todas).toHaveLength(3);
    expect(todas.filter((t) => t.alerta)).toHaveLength(1);
  });
});
