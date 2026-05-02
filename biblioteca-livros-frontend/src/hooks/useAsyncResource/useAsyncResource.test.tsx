import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAsyncResource } from "./useAsyncResource";

const deferred = <T,>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useAsyncResource", () => {
  it("should auto load on mount by default", async () => {
    const load = vi.fn(async () => ["a"]);
    const { result } = renderHook(() => useAsyncResource<string[]>([], load, () => "err"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(load).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(["a"]);
  });

  it("should not auto load when autoLoad=false", async () => {
    const load = vi.fn(async () => ["a"]);
    const { result } = renderHook(() => useAsyncResource<string[]>([], load, () => "err", { autoLoad: false }));

    expect(result.current.isLoading).toBe(false);
    expect(load).not.toHaveBeenCalled();
  });

  it("should ignore stale responses (out of order reloads)", async () => {
    const first = deferred<string[]>();
    const second = deferred<string[]>();
    const load = vi
      .fn<() => Promise<string[]>>()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);

    const { result } = renderHook(() => useAsyncResource<string[]>([], load, () => "err", { autoLoad: false }));

    await act(async () => {
      const p1 = result.current.reload();
      const p2 = result.current.reload();
      second.resolve(["new"]);
      await p2;
      first.resolve(["old"]);
      await p1;
    });

    expect(result.current.data).toEqual(["new"]);
  });

  it("should not set state after unmount", async () => {
    const d = deferred<string[]>();
    const load = vi.fn(async () => d.promise);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { unmount } = renderHook(() => useAsyncResource<string[]>([], load, () => "err"));
    unmount();

    d.resolve(["a"]);
    await Promise.resolve();

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

