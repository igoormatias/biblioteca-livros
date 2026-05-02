import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useConfirmDialog } from "./useConfirmDialog";

describe("useConfirmDialog", () => {
  it("should request and cancel", () => {
    const { result } = renderHook(() => useConfirmDialog<{ id: number }>());

    act(() => {
      result.current.request({ id: 1 });
    });
    expect(result.current.pending).toEqual({ id: 1 });

    act(() => {
      result.current.cancel();
    });
    expect(result.current.pending).toBeNull();
  });

  it("should confirm with snapshot item and clear pending on success", async () => {
    const run = vi.fn(async () => undefined);
    const { result } = renderHook(() => useConfirmDialog<{ id: number }>());

    act(() => {
      result.current.request({ id: 1 });
    });

    await act(async () => {
      await result.current.confirm(run);
    });

    expect(run).toHaveBeenCalledWith({ id: 1 });
    expect(result.current.pending).toBeNull();
    expect(result.current.isConfirming).toBe(false);
  });

  it("should keep pending if run throws", async () => {
    const run = vi.fn(async () => {
      throw new Error("fail");
    });
    const { result } = renderHook(() => useConfirmDialog<{ id: number }>());

    act(() => {
      result.current.request({ id: 1 });
    });

    await act(async () => {
      await expect(result.current.confirm(run)).resolves.toBeUndefined();
    });

    expect(result.current.pending).toEqual({ id: 1 });
    expect(result.current.isConfirming).toBe(false);
  });
});

