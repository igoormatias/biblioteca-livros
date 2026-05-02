import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrencyInput } from "./CurrencyInput";

describe("CurrencyInput", () => {
  it("should format and call onChange while typing", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={0} onChange={onChange} />);

    const input = screen.getByPlaceholderText("R$ 0,00");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "1234" } });

    expect(onChange).toHaveBeenLastCalledWith(12.34);
    expect((input as HTMLInputElement).value).toContain("12,34");
  });
});

