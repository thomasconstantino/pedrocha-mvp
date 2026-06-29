// Helpers de formatação PT-PT.

export const eur = (n: number): string =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export const eur2 = (n: number): string =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);

export const m2 = (n: number): string =>
  `${new Intl.NumberFormat('pt-PT').format(n)} m²`;

export const horas = (n: number): string =>
  `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 2 }).format(n)} h`;

export const dataPT = (iso: string): string =>
  new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
