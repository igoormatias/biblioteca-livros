import { useCallback, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAsyncResource, useConfirmDialog, useCrudModal, type ConfirmDialogState, type CrudModalState } from "../../../../../hooks";
import { toApiError } from "../../../../../services/apiError";
import { createAutor, deleteAutor, listAutores, updateAutor } from "../../../services/autores.service";
import type { Autor } from "../../../types";

export type UseAutoresPageResult = {
  autores: Autor[];
  isLoading: boolean;
  error: string | null;
  form: UseFormReturn<{ nome: string }>;
  modal: CrudModalState<Autor>;
  confirmDialog: ConfirmDialogState<Autor>;
  handleCreateClick: () => void;
  handleEditClick: (autor: Autor) => void;
  handleDeleteClick: (autor: Autor) => void;
  handleFormSubmit: (values: { nome: string }) => Promise<void>;
  handleDeleteConfirm: (autor: Autor) => Promise<void>;
  handleConfirmDeleteClick: () => void;
};

export const useAutoresPage = (): UseAutoresPageResult => {
  const schema = useMemo(
    () =>
      z.object({
        nome: z.string().trim().min(1, "Informe o nome.").max(40, "Máximo 40 caracteres."),
      }),
    [],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "" },
  });

  const { data: autores, isLoading, error, reload, setError } = useAsyncResource<Autor[]>(
    [],
    listAutores,
    (e) => toApiError(e).message,
  );

  const modalOpts = useMemo(
    () => ({
      onOpenCreate: () => form.reset({ nome: "" }),
      onOpenEdit: (autor: Autor) => form.reset({ nome: autor.nome }),
    }),
    [form],
  );

  const modal = useCrudModal<Autor>(modalOpts);
  const confirmDialog = useConfirmDialog<Autor>();

  const handleCreateClick = useCallback(() => {
    modal.openCreate();
  }, [modal]);

  const handleEditClick = useCallback(
    (autor: Autor) => {
      modal.openEdit(autor);
    },
    [modal],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      setError(null);
      try {
        if (modal.editingItem) {
          await updateAutor(modal.editingItem.codAu, values);
        } else {
          await createAutor(values);
        }
        modal.close();
        await reload();
      } catch (e) {
        setError(toApiError(e).message);
      }
    },
    [modal, reload, setError],
  );

  const handleDeleteClick = useCallback(
    (autor: Autor) => {
      confirmDialog.request(autor);
    },
    [confirmDialog],
  );

  const handleDeleteConfirm = useCallback(
    async (autor: Autor) => {
      setError(null);
      try {
        await deleteAutor(autor.codAu);
        confirmDialog.cancel();
        await reload();
      } catch (e) {
        setError(toApiError(e).message);
      }
    },
    [confirmDialog, reload, setError],
  );

  const handleConfirmDeleteClick = useCallback(() => {
    void confirmDialog.confirm(handleDeleteConfirm);
  }, [confirmDialog, handleDeleteConfirm]);

  return {
    autores,
    isLoading,
    error,
    form,
    modal,
    confirmDialog,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handleDeleteConfirm,
    handleConfirmDeleteClick,
  };
};

