import { useCallback, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAsyncResource, useConfirmDialog, useCrudModal, type ConfirmDialogState, type CrudModalState } from "../../../../../hooks";
import { toApiError } from "../../../../../services/apiError";
import { createAssunto, deleteAssunto, listAssuntos, updateAssunto } from "../../../services/assuntos.service";
import type { Assunto } from "../../../types";

export type UseAssuntosPageResult = {
  assuntos: Assunto[];
  isLoading: boolean;
  error: string | null;
  form: UseFormReturn<{ descricao: string }>;
  modal: CrudModalState<Assunto>;
  confirmDialog: ConfirmDialogState<Assunto>;
  handleCreateClick: () => void;
  handleEditClick: (assunto: Assunto) => void;
  handleDeleteClick: (assunto: Assunto) => void;
  handleFormSubmit: (values: { descricao: string }) => Promise<void>;
  handleDeleteConfirm: (assunto: Assunto) => Promise<void>;
  handleConfirmDeleteClick: () => void;
};

export const useAssuntosPage = (): UseAssuntosPageResult => {
  const schema = useMemo(
    () =>
      z.object({
        descricao: z.string().trim().min(1, "Informe a descrição.").max(20, "Máximo 20 caracteres."),
      }),
    [],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { descricao: "" },
  });

  const { data: assuntos, isLoading, error, reload, setError } = useAsyncResource<Assunto[]>(
    [],
    listAssuntos,
    (e) => toApiError(e).message,
  );

  const modalOpts = useMemo(
    () => ({
      onOpenCreate: () => form.reset({ descricao: "" }),
      onOpenEdit: (assunto: Assunto) => form.reset({ descricao: assunto.descricao }),
    }),
    [form],
  );

  const modal = useCrudModal<Assunto>(modalOpts);
  const confirmDialog = useConfirmDialog<Assunto>();

  const handleCreateClick = useCallback(() => {
    modal.openCreate();
  }, [modal]);

  const handleEditClick = useCallback(
    (assunto: Assunto) => {
      modal.openEdit(assunto);
    },
    [modal],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      setError(null);
      try {
        if (modal.editingItem) {
          await updateAssunto(modal.editingItem.codAs, values);
        } else {
          await createAssunto(values);
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
    (assunto: Assunto) => {
      confirmDialog.request(assunto);
    },
    [confirmDialog],
  );

  const handleDeleteConfirm = useCallback(
    async (assunto: Assunto) => {
      setError(null);
      try {
        await deleteAssunto(assunto.codAs);
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
    assuntos,
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

