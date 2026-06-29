// Tipos de domínio para a operação imobiliária PedroCha (MVP).

export interface Imovel {
  id: string;
  titulo: string;
  tipologia: string;
  tipo: string; // Moradia | Apartamento | Terreno | Quinta | Rústico
  localidade: string;
  concelho: string;
  preco_eur: number;
  area_m2: number;
  preco_por_m2: number;
  descricao: string;
  fonte_site: string;
  url: string;
  data_consulta: string;
  estado: 'ativo' | 'reservado' | 'arquivado';
}

export interface CriteriosRegras {
  preco_max_eur: number;
  preco_por_m2_max_eur: number;
  area_min_m2: number;
  concelhos_alvo: string[];
  tipos_alvo: string[];
}

export interface Criterios {
  nome: string;
  descricao: string;
  atualizado: string;
  regras: CriteriosRegras;
  notas: string;
}

export interface RazaoCriterio {
  criterio: string;
  cumpre: boolean;
  detalhe: string;
}

export interface AvaliacaoImovel {
  imovel: Imovel;
  alerta: boolean;
  razoes: RazaoCriterio[];
  razoes_falhadas: string[];
}

export interface Fatura {
  id: string;
  fornecedor: string;
  nif: string;
  descricao: string;
  valor_eur: number;
  iva_eur: number;
  total_eur: number;
  data: string;
  ficheiro_pdf: string;
  capturado_via: 'WhatsApp';
  capturado_em: string;
}

export interface Projeto {
  id: string;
  nome: string;
  imovel_id: string;
  localidade: string;
  estado: string;
  orcamento_eur: number;
  faturas: Fatura[];
}
