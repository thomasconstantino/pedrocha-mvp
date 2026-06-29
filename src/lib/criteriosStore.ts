// Edição de critérios no browser (site estático — sem backend).
// Os critérios editados são guardados em localStorage e usados para recalcular
// os alertas em tempo real nas páginas Critérios, Alertas e Visão Geral.
import criteriosData from '../data/criterios-aquisicao.json';
import type { CriteriosRegras } from './tipos';

const KEY = 'lumo:criterios:v1';
export const regrasDefault: CriteriosRegras = criteriosData.regras as CriteriosRegras;

export function getRegras(): CriteriosRegras {
  if (typeof localStorage === 'undefined') return regrasDefault;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return regrasDefault;
    return { ...regrasDefault, ...JSON.parse(raw) };
  } catch {
    return regrasDefault;
  }
}

export function setRegras(r: CriteriosRegras): void {
  localStorage.setItem(KEY, JSON.stringify(r));
}

export function resetRegras(): void {
  localStorage.removeItem(KEY);
}

export function isPersonalizado(): boolean {
  return typeof localStorage !== 'undefined' && !!localStorage.getItem(KEY);
}
