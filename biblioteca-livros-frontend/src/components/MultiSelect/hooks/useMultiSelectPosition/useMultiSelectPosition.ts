import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";

export type PanelPlacement = "bottom" | "top";

export type PanelPosition = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: PanelPlacement;
};

const PREFERRED_MAX_HEIGHT = 360;
const FLIP_THRESHOLD = 220;
const VIEWPORT_PADDING = 8;
const PANEL_OFFSET = 6;
const MIN_HEIGHT = 140;

const arePositionsEqual = (previous: PanelPosition | null, next: PanelPosition | null): boolean => {
  if (previous === next) return true;
  if (!previous || !next) return false;
  return (
    previous.top === next.top &&
    previous.bottom === next.bottom &&
    previous.left === next.left &&
    previous.width === next.width &&
    previous.maxHeight === next.maxHeight &&
    previous.placement === next.placement
  );
};

const computePosition = (rect: DOMRect): PanelPosition => {
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
  const spaceAbove = rect.top - VIEWPORT_PADDING;
  const placeAbove = spaceBelow < FLIP_THRESHOLD && spaceAbove > spaceBelow;

  if (placeAbove) {
    return {
      bottom: window.innerHeight - rect.top + PANEL_OFFSET,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(MIN_HEIGHT, Math.min(PREFERRED_MAX_HEIGHT, spaceAbove - PANEL_OFFSET)),
      placement: "top",
    };
  }

  return {
    top: rect.bottom + PANEL_OFFSET,
    left: rect.left,
    width: rect.width,
    maxHeight: Math.max(MIN_HEIGHT, Math.min(PREFERRED_MAX_HEIGHT, spaceBelow - PANEL_OFFSET)),
    placement: "bottom",
  };
};

export const useMultiSelectPosition = (
  triggerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): PanelPosition | null => {
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = computePosition(rect);
    setPosition((previous) => (arePositionsEqual(previous, next) ? previous : next));
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!enabled) return;
    updatePosition();
  }, [enabled, updatePosition]);

  useEffect(() => {
    if (!enabled) return;
    const handleViewportChange = () => updatePosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [enabled, updatePosition]);

  return enabled ? position : null;
};
