import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLivrosPage } from "./useLivrosPage";

vi.mock("../../../services/livros.service", () => ({
  listLivros: vi.fn(async () => [
    {
      codl: 10,
      titulo: "Dom Casmurro",
      editora: "Garnier",
      edicao: 1,
      anoPublicacao: "1899",
      valor: 12.34,
      autores: [{ codAu: 1, nome: "Machado" }],
      assuntos: [{ codAs: 1, descricao: "Romance" }],
    },
  ]),
  createLivro: vi.fn(async () => ({
    codl: 11,
    titulo: "Novo",
    editora: "Editora",
    edicao: 1,
    anoPublicacao: "2000",
    valor: 1,
    autores: [],
    assuntos: [],
  })),
  updateLivro: vi.fn(async () => ({
    codl: 10,
    titulo: "Editado",
    editora: "Garnier",
    edicao: 1,
    anoPublicacao: "1899",
    valor: 12.34,
    autores: [],
    assuntos: [],
  })),
  deleteLivro: vi.fn(async () => undefined),
}));

vi.mock("../../../../autores/services/autores.service", () => ({
  listAutores: vi.fn(async () => [{ codAu: 1, nome: "Machado" }]),
}));

vi.mock("../../../../assuntos/services/assuntos.service", () => ({
  listAssuntos: vi.fn(async () => [{ codAs: 1, descricao: "Romance" }]),
}));

import { createLivro, deleteLivro, listLivros, updateLivro } from "../../../services/livros.service";

describe("useLivrosPage", () => {
  it("should load livros, autores and assuntos on mount", async () => {
    const { result } = renderHook(() => useLivrosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listLivros).toHaveBeenCalled();
    expect(result.current.loadResult.livros).toHaveLength(1);
    expect(result.current.loadResult.autores).toHaveLength(1);
    expect(result.current.loadResult.assuntos).toHaveLength(1);
  });

  it("should create livro when not editing", async () => {
    const { result } = renderHook(() => useLivrosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleFormSubmit({
        titulo: "Novo",
        editora: "Editora",
        edicao: 1,
        anoPublicacao: "2000",
        valor: 1,
        autorIds: [1],
        assuntoIds: [1],
      });
    });

    expect(createLivro).toHaveBeenCalled();
  });

  it("should update livro when editing", async () => {
    const { result } = renderHook(() => useLivrosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.modal.openEdit({
        codl: 10,
        titulo: "Dom Casmurro",
        editora: "Garnier",
        edicao: 1,
        anoPublicacao: "1899",
        valor: 12.34,
        autores: [{ codAu: 1, nome: "Machado" }],
        assuntos: [{ codAs: 1, descricao: "Romance" }],
      });
    });

    await act(async () => {
      await result.current.handleFormSubmit({
        titulo: "Editado",
        editora: "Garnier",
        edicao: 1,
        anoPublicacao: "1899",
        valor: 12.34,
        autorIds: [1],
        assuntoIds: [1],
      });
    });

    expect(updateLivro).toHaveBeenCalledWith(10, expect.any(Object));
  });

  it("should delete livro", async () => {
    const { result } = renderHook(() => useLivrosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteConfirm({
        codl: 10,
        titulo: "Dom Casmurro",
        editora: "Garnier",
        edicao: 1,
        anoPublicacao: "1899",
        valor: 12.34,
        autores: [],
        assuntos: [],
      });
    });

    expect(deleteLivro).toHaveBeenCalledWith(10);
  });
});

