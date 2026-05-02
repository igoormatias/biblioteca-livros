import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RelatorioPage } from "./RelatorioPage";

const handleDownloadCsv = vi.fn(async () => undefined);

vi.mock("./hooks/useRelatorioPage", () => ({
  obrasEncontradasLabel: (n: number) => `${n} obras encontradas`,
  useRelatorioPage: () => ({
    data: [{ codAutor: 1, codLivro: 1, nomeAutor: "A", titulo: "T", editora: "E", edicao: 1, anoPublicacao: "2000", valor: 1, assuntos: "X" }],
    grouped: [{ autorCodAu: 1, autorNome: "A", itens: [{ codAutor: 1, codLivro: 1, nomeAutor: "A", titulo: "T", editora: "E", edicao: 1, anoPublicacao: "2000", valor: 1, assuntos: "X" }] }],
    loading: false,
    error: null,
    totalObras: 1,
    handleDownloadCsv,
    handleDownloadPdf: vi.fn(async () => undefined),
  }),
}));

describe("RelatorioPage", () => {
  it("should render and trigger download csv", () => {
    render(<RelatorioPage />);
    expect(screen.getByText("Relatório por autor")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /baixar csv/i }));
    expect(handleDownloadCsv).toHaveBeenCalled();
  });
});

