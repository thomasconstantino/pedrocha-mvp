// Camada de acesso a dados — fonte única para todas as páginas.
// Importa os dados estáticos (JSON) e calcula os valores derivados.

import imoveisData from '../data/imoveis.json';
import criteriosData from '../data/criterios-aquisicao.json';
import poupancaData from '../data/poupanca-tempo.json';
import projetosData from '../data/projetos.json';
import { avaliarTodos, imoveisComAlerta } from './alertas';
import type { Imovel, Criterios, Projeto } from './tipos';

export const imoveis = imoveisData as Imovel[];
export const criterios = criteriosData as Criterios;
export const projetos = (projetosData as { projetos: Projeto[] }).projetos;

// --- Imóveis ---
export const imoveisAtivos = imoveis.filter((i) => i.estado === 'ativo');
export const totalImoveis = imoveis.length;
export const totalAtivos = imoveisAtivos.length;

// --- Alertas de aquisição ---
export const avaliacoes = avaliarTodos(imoveis, criterios);
export const alertas = imoveisComAlerta(imoveis, criterios);
export const totalAlertas = alertas.length;

// --- Tempo poupado ---
export const poupanca = poupancaData as {
  titulo: string;
  descricao: string;
  atualizado: string;
  itens: { tarefa: string; antes: string; agora: string; horas_semana: number }[];
};
export const horasPoupadasSemana = Number(
  poupanca.itens.reduce((s, i) => s + i.horas_semana, 0).toFixed(2),
);

// --- Centros de custo / faturas ---
export const totalFaturas = projetos.reduce((s, p) => s + p.faturas.length, 0);
export const valorFaturasCapturado = projetos.reduce(
  (s, p) => s + p.faturas.reduce((a, f) => a + f.total_eur, 0),
  0,
);
// 100% capturadas: toda a fatura tem origem WhatsApp + PDF arquivado.
export const faturasCapturadas = projetos.reduce(
  (s, p) => s + p.faturas.filter((f) => f.capturado_via === 'WhatsApp' && !!f.ficheiro_pdf).length,
  0,
);
export const percentagemCaptura =
  totalFaturas === 0 ? 0 : Math.round((faturasCapturadas / totalFaturas) * 100);

export function gastoProjeto(p: Projeto): number {
  return p.faturas.reduce((s, f) => s + f.total_eur, 0);
}

// --- Projetos (imóveis em renovação) ---
export const totalProjetos = projetos.length;
export const orcamentoTotal = projetos.reduce((s, p) => s + p.orcamento_eur, 0);
export const gastoTotal = projetos.reduce((s, p) => s + gastoProjeto(p), 0);

/** Progresso do projeto pelas fases: concluída = 1, em curso = 0.5, planeada = 0. */
export function progressoProjeto(p: Projeto): number {
  if (p.fases.length === 0) return 0;
  const pts = p.fases.reduce(
    (s, f) => s + (f.estado === 'concluida' ? 1 : f.estado === 'em_curso' ? 0.5 : 0),
    0,
  );
  return Math.round((pts / p.fases.length) * 100);
}
