import type { RelatorioLivroPorAutorItem } from "./relatorio.service.js";

const BOM = "\uFEFF";

const HEADER = [
  "codAutor",
  "nomeAutor",
  "codLivro",
  "titulo",
  "editora",
  "edicao",
  "anoPublicacao",
  "valor",
  "assuntos",
];

function escapeCsvCell(value: string | number): string {
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function formatRelatorioCsv(rows: RelatorioLivroPorAutorItem[]): string {
  const lines = [
    HEADER.join(","),
    ...rows.map((r) =>
      [
        r.codAutor,
        r.nomeAutor,
        r.codLivro,
        r.titulo,
        r.editora,
        r.edicao,
        r.anoPublicacao,
        r.valor,
        r.assuntos,
      ]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];
  return BOM + lines.join("\r\n");
}
