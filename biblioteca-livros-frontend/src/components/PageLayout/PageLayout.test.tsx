import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render navigation", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<div>Conteúdo</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Biblioteca")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Início" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Livros" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Autores" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Assuntos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Relatório" })).toBeInTheDocument();

    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("should highlight the current route in the navigation", () => {
    render(
      <MemoryRouter initialEntries={["/relatorio"]}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/relatorio" element={<div>Relatório</div>} />
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const activeLink = screen.getByRole("link", { name: "Relatório" });
    expect(activeLink).toHaveClass("text-primary");
    expect(activeLink).toHaveClass("font-semibold");
  });
});

