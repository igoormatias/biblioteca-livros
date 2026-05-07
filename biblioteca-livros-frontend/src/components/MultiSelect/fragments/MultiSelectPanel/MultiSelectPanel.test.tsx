import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PanelPosition } from "../../hooks/useMultiSelectPosition";
import { MultiSelectPanel } from "./MultiSelectPanel";

const position: PanelPosition = {
  top: 50,
  left: 0,
  width: 200,
  maxHeight: 300,
  placement: "bottom",
};

describe("MultiSelectPanel", () => {
  afterEach(() => {
    cleanup();
  });
  const buildBaseProps = () => ({
    panelRef: createRef<HTMLDivElement>(),
    listboxId: "listbox",
    position,
    query: "",
    onQueryChange: vi.fn(),
    onSearchEnter: vi.fn(),
    options: [
      { value: 1, label: "A" },
      { value: 2, label: "B" },
    ],
    values: [1] as number[],
    onToggle: vi.fn(),
    searchPlaceholder: "Buscar...",
    emptyText: "Nada",
  });

  it("should render search input and listbox via portal", () => {
    render(<MultiSelectPanel {...buildBaseProps()} />);
    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should show empty text when options is empty", () => {
    render(<MultiSelectPanel {...buildBaseProps()} options={[]} />);
    expect(screen.getByText("Nada")).toBeInTheDocument();
  });

  it("should call onToggle when clicking an option", () => {
    const onToggle = vi.fn();
    render(<MultiSelectPanel {...buildBaseProps()} onToggle={onToggle} />);
    fireEvent.click(screen.getByText("B"));
    expect(onToggle).toHaveBeenCalledWith(2);
  });

  it("should call onQueryChange while typing", () => {
    const onQueryChange = vi.fn();
    render(<MultiSelectPanel {...buildBaseProps()} onQueryChange={onQueryChange} />);
    fireEvent.change(screen.getByPlaceholderText("Buscar..."), { target: { value: "ab" } });
    expect(onQueryChange).toHaveBeenCalledWith("ab");
  });

  it("should call onSearchEnter on Enter key", () => {
    const onSearchEnter = vi.fn();
    render(<MultiSelectPanel {...buildBaseProps()} onSearchEnter={onSearchEnter} />);
    fireEvent.keyDown(screen.getByPlaceholderText("Buscar..."), { key: "Enter" });
    expect(onSearchEnter).toHaveBeenCalledTimes(1);
  });

  it("should mark selected options with aria-selected", () => {
    render(<MultiSelectPanel {...buildBaseProps()} />);
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });
});
