import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { RefObject } from "react";
import { useMultiSelectPosition } from "./useMultiSelectPosition";

const buildRef = (rect: Partial<DOMRect>): RefObject<HTMLElement | null> =>
  ({
    current: {
      getBoundingClientRect: () =>
        ({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => "",
          ...rect,
        }) as DOMRect,
    },
  }) as unknown as RefObject<HTMLElement | null>;

beforeEach(() => {
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
});

describe("useMultiSelectPosition", () => {
  it("should return null when disabled", () => {
    const { result } = renderHook(() => useMultiSelectPosition(buildRef({}), false));
    expect(result.current).toBeNull();
  });

  it("should compute bottom placement when space below is enough", () => {
    const triggerRef = buildRef({ top: 100, bottom: 140, left: 10, width: 200 });
    const { result } = renderHook(() => useMultiSelectPosition(triggerRef, true));
    expect(result.current?.placement).toBe("bottom");
    expect(result.current?.top).toBe(146);
    expect(result.current?.left).toBe(10);
    expect(result.current?.width).toBe(200);
  });

  it("should flip to top placement when space below is tight", () => {
    const triggerRef = buildRef({ top: 700, bottom: 740, left: 10, width: 200 });
    const { result } = renderHook(() => useMultiSelectPosition(triggerRef, true));
    expect(result.current?.placement).toBe("top");
    expect(result.current?.bottom).toBe(106);
  });

  it("should preserve identity when position does not change on resize", () => {
    const triggerRef = buildRef({ top: 100, bottom: 140, left: 10, width: 200 });
    const { result } = renderHook(() => useMultiSelectPosition(triggerRef, true));
    const first = result.current;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(first);
  });
});
