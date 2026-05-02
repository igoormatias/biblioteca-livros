import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRelatorioPage } from "./useRelatorioPage";

vi.mock("../../../services/relatorio.service", () => ({
  getRelatorioLivrosPorAutor: vi.fn(async () => ({
    agrupadoPor: "autor",
    itens: [
      {
        codAutor: 1,
        nomeAutor: "Autor 1",
        codLivro: 10,
        titulo: "Livro 1",
        editora: "Editora",
        edicao: 1,
        anoPublicacao: "2000",
        valor: 12.34,
        assuntos: "Romance",
      },
    ],
  })),
  downloadRelatorioLivrosPorAutorCsv: vi.fn(async () => new Blob(["a,b"], { type: "text/csv" })),
}));

vi.mock("../../../../../services/download", () => ({
  downloadBlob: vi.fn(),
}));

vi.mock("@react-pdf/renderer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@react-pdf/renderer")>();
  return {
    ...actual,
    pdf: () => ({
      toBlob: async () => new Blob(["pdf"], { type: "application/pdf" }),
    }),
  };
});

import { downloadRelatorioLivrosPorAutorCsv, getRelatorioLivrosPorAutor } from "../../../services/relatorio.service";
import { downloadBlob } from "../../../../../services/download";

describe("useRelatorioPage", () => {
  it("should load data on mount and group by autor", async () => {
    const { result } = renderHook(() => useRelatorioPage());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getRelatorioLivrosPorAutor).toHaveBeenCalled();
    expect(result.current.data).toHaveLength(1);
    expect(result.current.grouped).toHaveLength(1);
    expect(result.current.grouped[0]?.autorNome).toBe("Autor 1");
  });

  it("should download csv", async () => {
    const { result } = renderHook(() => useRelatorioPage());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDownloadCsv();
    });

    expect(downloadRelatorioLivrosPorAutorCsv).toHaveBeenCalled();
    expect(downloadBlob).toHaveBeenCalled();
  });

  it("should download pdf", async () => {
    const { result } = renderHook(() => useRelatorioPage());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDownloadPdf();
    });

    expect(downloadBlob).toHaveBeenCalled();
  });
});

