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

/** Fase atual: a que está em curso, ou a última concluída. */
export function faseAtual(p: Projeto): string {
  const emCurso = p.fases.find((f) => f.estado === 'em_curso');
  if (emCurso) return emCurso.nome;
  const concl = p.fases.filter((f) => f.estado === 'concluida');
  return concl.length ? concl[concl.length - 1].nome : p.fases[0]?.nome ?? '—';
}

export const conclusaoMedia =
  totalProjetos === 0
    ? 0
    : Math.round(projetos.reduce((s, p) => s + progressoProjeto(p), 0) / totalProjetos);

export const orcamentoUtilizadoPct =
  orcamentoTotal === 0 ? 0 : Math.round((gastoTotal / orcamentoTotal) * 100);

/** Faturas mais recentes (todas as obras), ordenadas por data desc. */
export const faturasRecentes = projetos
  .flatMap((p) => p.faturas.map((fatura) => ({ fatura, projeto: p })))
  .sort((a, b) => b.fatura.data.localeCompare(a.fatura.data))
  .slice(0, 5);

/** Anúncios monitorizados por concelho (para a vista de oportunidades). */
export const imoveisPorConcelho = Object.entries(
  imoveis.reduce<Record<string, number>>((m, i) => {
    m[i.concelho] = (m[i.concelho] || 0) + 1;
    return m;
  }, {}),
)
  .map(([concelho, total]) => ({ concelho, total }))
  .sort((a, b) => b.total - a.total);
