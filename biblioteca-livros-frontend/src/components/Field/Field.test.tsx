import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldError, FieldHint, FieldLabel, Input, Select } from "./Field";

describe("Field", () => {
  it("should render label and hint", () => {
    render(
      <div>
        <FieldLabel htmlFor="x">Nome</FieldLabel>
        <FieldHint>Dica</FieldHint>
        <Input id="x" />
      </div>,
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Dica")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render select", () => {
    render(
      <Select aria-label="s">
        <option value="1">Um</option>
      </Select>,
    );
    expect(screen.getByLabelText("s")).toBeInTheDocument();
  });

  it("should render error only when provided", () => {
    const { rerender } = render(<FieldError />);
    expect(screen.queryByText("Erro")).not.toBeInTheDocument();
    rerender(<FieldError>Erro</FieldError>);
    expect(screen.getByText("Erro")).toBeInTheDocument();
  });
});

