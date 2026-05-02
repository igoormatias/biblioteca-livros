import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAssuntosPage } from "./useAssuntosPage";

vi.mock("../../../services/assuntos.service", () => ({
  listAssuntos: vi.fn(async () => [{ codAs: 1, descricao: "Assunto 1" }]),
  createAssunto: vi.fn(async () => ({ codAs: 2, descricao: "Novo" })),
  updateAssunto: vi.fn(async () => ({ codAs: 1, descricao: "Editado" })),
  deleteAssunto: vi.fn(async () => undefined),
}));

import { createAssunto, deleteAssunto, listAssuntos, updateAssunto } from "../../../services/assuntos.service";

describe("useAssuntosPage", () => {
  it("should load assuntos on mount", async () => {
    const { result } = renderHook(() => useAssuntosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listAssuntos).toHaveBeenCalled();
    expect(result.current.assuntos).toEqual([{ codAs: 1, descricao: "Assunto 1" }]);
  });

  it("should create assunto when not editing", async () => {
    const { result } = renderHook(() => useAssuntosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleFormSubmit({ descricao: "Novo" });
    });

    expect(createAssunto).toHaveBeenCalledWith({ descricao: "Novo" });
  });

  it("should update assunto when editing", async () => {
    const { result } = renderHook(() => useAssuntosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.modal.openEdit({ codAs: 1, descricao: "Assunto 1" });
    });

    await act(async () => {
      await result.current.handleFormSubmit({ descricao: "Editado" });
    });

    expect(updateAssunto).toHaveBeenCalledWith(1, { descricao: "Editado" });
  });

  it("should delete assunto", async () => {
    const { result } = renderHook(() => useAssuntosPage());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteConfirm({ codAs: 1, descricao: "Assunto 1" });
    });

    expect(deleteAssunto).toHaveBeenCalledWith(1);
  });
});

