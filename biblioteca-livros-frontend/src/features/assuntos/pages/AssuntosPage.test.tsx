import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssuntosPage } from "./AssuntosPage";

const handleCreateClick = vi.fn();

vi.mock("./hooks/useAssuntosPage", () => ({
  useAssuntosPage: () => ({
    assuntos: [],
    isLoading: false,
    error: null,
    form: {
      handleSubmit: (fn: any) => fn,
      formState: { isSubmitting: false, errors: {} },
      register: () => ({}),
    },
    modal: { isOpen: false, editingItem: null, close: vi.fn() },
    confirmDialog: { pending: null, cancel: vi.fn() },
    handleCreateClick,
    handleEditClick: vi.fn(),
    handleDeleteClick: vi.fn(),
    handleFormSubmit: vi.fn(async () => undefined),
    handleConfirmDeleteClick: vi.fn(),
  }),
}));

describe("AssuntosPage", () => {
  it("should render and call create click", () => {
    render(<AssuntosPage />);

    expect(screen.getByText("Assuntos")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /novo assunto/i }));
    expect(handleCreateClick).toHaveBeenCalled();
  });
});

