import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCrudModal } from "./useCrudModal";

describe("useCrudModal", () => {
  it("should open create and clear editingItem", () => {
    const onOpenCreate = vi.fn();
    const { result } = renderHook(() => useCrudModal<{ id: number }>({ onOpenCreate }));

    act(() => {
      result.current.openEdit({ id: 1 });
      result.current.openCreate();
    });

    expect(onOpenCreate).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
    expect(result.current.editingItem).toBeNull();
  });

  it("should open edit and call onOpenEdit", () => {
    const onOpenEdit = vi.fn();
    const { result } = renderHook(() => useCrudModal<{ id: number }>({ onOpenEdit }));

    act(() => {
      result.current.openEdit({ id: 1 });
    });

    expect(onOpenEdit).toHaveBeenCalledWith({ id: 1 });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.editingItem).toEqual({ id: 1 });
  });

  it("should close and call onClose", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useCrudModal<{ id: number }>({ onClose }));

    act(() => {
      result.current.openEdit({ id: 1 });
      result.current.close();
    });

    expect(onClose).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
  });
});

