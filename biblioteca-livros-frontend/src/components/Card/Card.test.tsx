import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardHeader, CardTitle, PageTitle } from "./Card";

describe("Card", () => {
  it("should render sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
      </Card>,
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("should render page title", () => {
    render(<PageTitle title="Início" subtitle="Sub" />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Sub")).toBeInTheDocument();
  });
});

