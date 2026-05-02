import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("should render quick access links", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Livros" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Autores" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Assuntos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver relatório por autor" })).toBeInTheDocument();
  });
});

