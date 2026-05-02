import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table, TableEmpty, Td, Th } from "./Table";

describe("Table", () => {
  it("should render head and body cells", () => {
    render(
      <Table>
        <thead>
          <tr>
            <Th>Col</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Val</Td>
          </tr>
        </tbody>
      </Table>,
    );

    expect(screen.getByText("Col")).toBeInTheDocument();
    expect(screen.getByText("Val")).toBeInTheDocument();
  });

  it("should render empty state", () => {
    render(<TableEmpty>Sem dados</TableEmpty>);
    expect(screen.getByText("Sem dados")).toBeInTheDocument();
  });
});

