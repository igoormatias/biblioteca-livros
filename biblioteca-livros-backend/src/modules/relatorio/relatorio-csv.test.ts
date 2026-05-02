import { describe, it, expect } from "vitest";
import { formatRelatorioCsv } from "./relatorio-csv.js";
import type { RelatorioLivroPorAutorItem } from "./relatorio.service.js";

describe("formatRelatorioCsv", () => {
  it("should include UTF-8 BOM, header row and escaped cells", () => {
    const rows: RelatorioLivroPorAutorItem[] = [
      {
        codAutor: 1,
        nomeAutor: "Silva, João",
        codLivro: 2,
        titulo: "Dom X",
        editora: "Ed",
        edicao: 1,
        anoPublicacao: "2000",
        valor: 10.5,
        assuntos: "A, B",
      },
    ];
    const csv = formatRelatorioCsv(rows);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("codAutor,nomeAutor,codLivro");
    expect(csv).toContain('"Silva, João"');
    expect(csv).toContain('"A, B"');
  });
});
