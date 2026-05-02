import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackToTopButton } from "./BackToTopButton";

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
  });
  document.documentElement.scrollTop = value;
};

const triggerScroll = () => {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

const stubMatchMedia = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      media: matches ? "(prefers-reduced-motion: reduce)" : "",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  );
};

describe("BackToTopButton", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setScrollY(0);
    document.body.scrollTop = 0;
  });

  it("should not render the button when scrollY is below threshold", () => {
    render(<BackToTopButton />);

    expect(screen.queryByRole("button", { name: /voltar ao topo/i })).toBeNull();
  });

  it("should render the button when scrollY exceeds the threshold", () => {
    render(<BackToTopButton threshold={100} />);

    setScrollY(500);
    triggerScroll();

    expect(screen.getByRole("button", { name: /voltar ao topo/i })).toBeInTheDocument();
  });

  it("should call window.scrollTo with smooth behavior on click", () => {
    const scrollToSpy = vi.fn();
    vi.stubGlobal("scrollTo", scrollToSpy);
    stubMatchMedia(false);

    render(<BackToTopButton threshold={50} />);
    setScrollY(300);
    triggerScroll();

    fireEvent.click(screen.getByRole("button", { name: /voltar ao topo/i }));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "smooth" });
  });

  it("should call window.scrollTo with auto behavior when prefers-reduced-motion is set", () => {
    const scrollToSpy = vi.fn();
    vi.stubGlobal("scrollTo", scrollToSpy);
    stubMatchMedia(true);

    render(<BackToTopButton threshold={50} />);
    setScrollY(300);
    triggerScroll();

    fireEvent.click(screen.getByRole("button", { name: /voltar ao topo/i }));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it("should remove the scroll listener on unmount", () => {
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const removeDoc = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<BackToTopButton />);
    unmount();

    expect(removeWindow).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeDoc).toHaveBeenCalledWith("scroll", expect.any(Function), { capture: true });
  });
});
