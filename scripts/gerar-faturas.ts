/**
 * Gera PDFs de faturas de obra (mock) para cada centro de custo.
 *
 * Lê src/data/projetos.json e escreve um PDF por fatura em
 * public/faturas/{PROJETO}/{FATURA}.pdf.
 *
 * NÃO existe qualquer integração real com o WhatsApp — estes PDFs simulam
 * faturas que, numa versão futura, seriam capturadas a partir do WhatsApp.
 *
 * Executar:  bun run gen:faturas
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import projetosData from '../src/data/projetos.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const eur = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);

const dataPT = (iso: string) =>
  new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(iso),
  );

async function gerarFatura(projeto: any, fatura: any): Promise<string> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const terra = rgb(0.77, 0.42, 0.25);
  const dark = rgb(0.13, 0.13, 0.13);
  const grey = rgb(0.45, 0.45, 0.45);

  const text = (
    s: string,
    x: number,
    y: number,
    size = 10,
    f = font,
    color = dark,
  ) => page.drawText(s, { x, y, size, font: f, color });

  // Cabeçalho
  page.drawRectangle({ x: 0, y: 792, width: 595, height: 50, color: terra });
  text('FATURA', 40, 808, 20, bold, rgb(1, 1, 1));
  text(fatura.id, 460, 808, 12, bold, rgb(1, 1, 1));

  // Fornecedor
  let y = 750;
  text('FORNECEDOR', 40, y, 8, bold, grey);
  text(fatura.fornecedor, 40, y - 16, 12, bold);
  text(`NIF: ${fatura.nif}`, 40, y - 32, 10, font, grey);

  // Cliente
  text('CLIENTE', 360, y, 8, bold, grey);
  text('PedroCha — Operação Imobiliária', 360, y - 16, 11, bold);
  text('Vidigueira, Beja, Portugal', 360, y - 32, 10, font, grey);
  text('NIF: 245 678 901', 360, y - 46, 10, font, grey);

  // Meta
  y = 680;
  text(`Data: ${dataPT(fatura.data)}`, 40, y, 10, bold);
  text(`Projeto: ${projeto.nome}`, 40, y - 16, 10);
  text(`Centro de custo: ${projeto.id}  ·  Imóvel: ${projeto.imovel_id}`, 40, y - 32, 10, font, grey);

  // Linha separadora
  page.drawLine({ start: { x: 40, y: 620 }, end: { x: 555, y: 620 }, thickness: 1, color: terra });

  // Tabela
  y = 600;
  text('DESCRIÇÃO', 40, y, 9, bold, grey);
  text('VALOR', 360, y, 9, bold, grey);
  text('IVA', 430, y, 9, bold, grey);
  text('TOTAL', 500, y, 9, bold, grey);

  y -= 22;
  text(fatura.descricao, 40, y, 10);
  text(eur(fatura.valor_eur), 360, y, 10);
  text(eur(fatura.iva_eur), 430, y, 10);
  text(eur(fatura.total_eur), 500, y, 10, bold);

  // Totais
  page.drawLine({ start: { x: 360, y: y - 18 }, end: { x: 555, y: y - 18 }, thickness: 0.5, color: grey });
  text('Subtotal', 360, y - 36, 10, font, grey);
  text(eur(fatura.valor_eur), 500, y - 36, 10);
  text('IVA', 360, y - 52, 10, font, grey);
  text(eur(fatura.iva_eur), 500, y - 52, 10);
  text('TOTAL A PAGAR', 360, y - 74, 11, bold);
  text(eur(fatura.total_eur), 500, y - 74, 11, bold, terra);

  // Rodapé — marca de captura
  text(
    `Capturado via WhatsApp em ${dataPT(fatura.capturado_em)} — documento de demonstração (mock).`,
    40,
    60,
    8,
    font,
    grey,
  );
  text('PedroCha MVP · Centro de custo de obra', 40, 46, 8, font, grey);

  const bytes = await doc.save();
  const rel = fatura.ficheiro_pdf.replace(/^\//, ''); // faturas/PRJ-01/FT-...pdf
  const out = join(PUBLIC, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, bytes);
  return out;
}

async function main() {
  let n = 0;
  for (const projeto of (projetosData as any).projetos) {
    for (const fatura of projeto.faturas) {
      const out = await gerarFatura(projeto, fatura);
      console.log(`✓ ${projeto.id} / ${fatura.id} → ${out}`);
      n++;
    }
  }
  console.log(`\nGeradas ${n} faturas de obra (PDF).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
