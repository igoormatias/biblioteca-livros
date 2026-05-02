import { describe, expect, it } from "vitest";
import { pdf } from "@react-pdf/renderer";
import { RelatorioPdfDocument } from "./RelatorioPdfDocument";

describe("RelatorioPdfDocument", () => {
  it("should generate a PDF buffer", async () => {
    const groups = [
      {
        autorCodAu: 1,
        autorNome: "Machado de Assis",
        itens: [
          {
            codAutor: 1,
            nomeAutor: "Machado de Assis",
            codLivro: 10,
            titulo: "Dom Casmurro",
            editora: "Garnier",
            edicao: 1,
            anoPublicacao: "1899",
            valor: 12.34,
            assuntos: "Romance",
          },
        ],
      },
    ];

    const out = await pdf(
      <RelatorioPdfDocument groups={groups} generatedAt={new Date("2026-01-01T00:00:00Z")} />,
    ).toBlob();
    expect(out.size).toBeGreaterThan(0);
  });
});

