import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AutoresPage } from "./AutoresPage";

const handleCreateClick = vi.fn();

vi.mock("./hooks/useAutoresPage", () => ({
  useAutoresPage: () => ({
    autores: [],
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

describe("AutoresPage", () => {
  it("should render and call create click", () => {
    render(<AutoresPage />);

    expect(screen.getByText("Autores")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /novo autor/i }));

    expect(handleCreateClick).toHaveBeenCalled();
  });
});

