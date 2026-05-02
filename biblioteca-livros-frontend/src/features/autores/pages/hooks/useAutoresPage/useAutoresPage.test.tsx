import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAutoresPage } from "./useAutoresPage";

vi.mock("../../../services/autores.service", () => ({
  listAutores: vi.fn(async () => [{ codAu: 1, nome: "Autor 1" }]),
  createAutor: vi.fn(async () => ({ codAu: 2, nome: "Novo" })),
  updateAutor: vi.fn(async () => ({ codAu: 1, nome: "Editado" })),
  deleteAutor: vi.fn(async () => undefined),
}));

import { createAutor, deleteAutor, listAutores, updateAutor } from "../../../services/autores.service";

describe("useAutoresPage", () => {
  it("should load autores on mount", async () => {
    const { result } = renderHook(() => useAutoresPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listAutores).toHaveBeenCalled();
    expect(result.current.autores).toEqual([{ codAu: 1, nome: "Autor 1" }]);
  });

  it("should create autor when not editing", async () => {
    const { result } = renderHook(() => useAutoresPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleFormSubmit({ nome: "Novo" });
    });

    expect(createAutor).toHaveBeenCalledWith({ nome: "Novo" });
  });

  it("should update autor when editing", async () => {
    const { result } = renderHook(() => useAutoresPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.modal.openEdit({ codAu: 1, nome: "Autor 1" });
    });

    await act(async () => {
      await result.current.handleFormSubmit({ nome: "Editado" });
    });

    expect(updateAutor).toHaveBeenCalledWith(1, { nome: "Editado" });
  });

  it("should delete autor", async () => {
    const { result } = renderHook(() => useAutoresPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteConfirm({ codAu: 1, nome: "Autor 1" });
    });

    expect(deleteAutor).toHaveBeenCalledWith(1);
  });
});

