import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
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
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});

