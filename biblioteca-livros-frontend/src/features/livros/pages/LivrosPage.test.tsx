import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LivrosPage } from "./LivrosPage";

const handleCreateClick = vi.fn();

vi.mock("./hooks/useLivrosPage", () => ({
  useLivrosPage: () => ({
    loadResult: { livros: [], autores: [], assuntos: [] },
    isLoading: false,
    error: null,
    form: {
      handleSubmit: (fn: any) => fn,
      formState: { isSubmitting: false, errors: {} },
      register: () => ({}),
      control: {},
    },
    modal: { isOpen: false, editingItem: null, close: vi.fn() },
    confirmDialog: { pending: null, cancel: vi.fn() },
    handleCreateClick,
    handleEditClick: vi.fn(),
    handleDeleteClick: vi.fn(),
    handleFormSubmit: vi.fn(async () => undefined),
    handleDeleteConfirm: vi.fn(async () => undefined),
    handleConfirmDeleteClick: vi.fn(),
  }),
}));

describe("LivrosPage", () => {
  it("should render and call create click", () => {
    render(<LivrosPage />);

    expect(screen.getByText("Livros")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /novo livro/i }));
    expect(handleCreateClick).toHaveBeenCalled();
  });
});

