import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MultiSelectTrigger } from "./MultiSelectTrigger";

describe("MultiSelectTrigger", () => {
  const baseProps = {
    open: false,
    placeholder: "Selecione",
    selectedOptions: [] as { value: number; label: string }[],
    listboxId: "listbox",
    onToggle: vi.fn(),
    onRemove: vi.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it("should render placeholder when no selection", () => {
    render(<MultiSelectTrigger {...baseProps} />);
    expect(screen.getByText("Selecione")).toBeInTheDocument();
  });

  it("should render selected chips", () => {
    render(
      <MultiSelectTrigger
        {...baseProps}
        selectedOptions={[
          { value: 1, label: "Aut A" },
          { value: 2, label: "Aut B" },
        ]}
      />,
    );
    expect(screen.getByText("Aut A")).toBeInTheDocument();
    expect(screen.getByText("Aut B")).toBeInTheDocument();
  });

  it("should call onToggle on click", () => {
    const onToggle = vi.fn();
    render(<MultiSelectTrigger {...baseProps} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("should call onRemove on chip X click without firing onToggle", () => {
    const onToggle = vi.fn();
    const onRemove = vi.fn();
    render(
      <MultiSelectTrigger
        {...baseProps}
        selectedOptions={[{ value: 1, label: "Aut A" }]}
        onToggle={onToggle}
        onRemove={onRemove}
      />,
    );
    fireEvent.click(screen.getByLabelText("Remover Aut A"));
    expect(onRemove).toHaveBeenCalledWith(1);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("should reflect open prop in aria-expanded", () => {
    const { rerender } = render(<MultiSelectTrigger {...baseProps} open={false} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
    rerender(<MultiSelectTrigger {...baseProps} open={true} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });
});
