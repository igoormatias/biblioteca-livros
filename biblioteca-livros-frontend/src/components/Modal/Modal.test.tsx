import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("should render when open", () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Confirmar" onClose={onClose}>
        Conteúdo
      </Modal>,
    );
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});

