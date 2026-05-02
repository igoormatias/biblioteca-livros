import { useCallback, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useAsyncResource, useConfirmDialog, useCrudModal, type ConfirmDialogState, type CrudModalState } from "../../../../../hooks";
import { toApiError } from "../../../../../services/apiError";
import { listAutores } from "../../../../autores/services/autores.service";
import type { Autor } from "../../../../autores/types";
import { listAssuntos } from "../../../../assuntos/services/assuntos.service";
import type { Assunto } from "../../../../assuntos/types";
import { createLivro, deleteLivro, listLivros, updateLivro } from "../../../services/livros.service";
import type { Livro } from "../../../types";

type LoadResult = { livros: Livro[]; autores: Autor[]; assuntos: Assunto[] };

const schema = z.object({
  titulo: z.string().trim().min(1, "Informe o título.").max(40, "Máximo 40 caracteres."),
  editora: z.string().trim().min(1, "Informe a editora.").max(40, "Máximo 40 caracteres."),
  edicao: z.number().int().positive("Edição deve ser um inteiro positivo."),
  anoPublicacao: z
    .string()
    .trim()
    .length(4, "Ano deve ter 4 dígitos.")
    .regex(/^[0-9]{4}$/, "Informe o ano com 4 dígitos."),
  valor: z.number().nonnegative("Valor não pode ser negativo."),
  autorIds: z.array(z.number().int().positive()).min(1, "Selecione ao menos 1 autor."),
  assuntoIds: z.array(z.number().int().positive()).min(1, "Selecione ao menos 1 assunto."),
});

type FormValues = z.infer<typeof schema>;

export type UseLivrosPageResult = {
  loadResult: LoadResult;
  isLoading: boolean;
  error: string | null;
  form: UseFormReturn<FormValues>;
  modal: CrudModalState<Livro>;
  confirmDialog: ConfirmDialogState<Livro>;
  handleCreateClick: () => void;
  handleEditClick: (livro: Livro) => void;
  handleDeleteClick: (livro: Livro) => void;
  handleFormSubmit: (values: FormValues) => Promise<void>;
  handleDeleteConfirm: (livro: Livro) => Promise<void>;
  handleConfirmDeleteClick: () => void;
};

export const useLivrosPage = (): UseLivrosPageResult => {
  const resolver = useMemo(() => zodResolver(schema), []);

  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      titulo: "",
      editora: "",
      edicao: 1,
      anoPublicacao: "",
      valor: 0,
      autorIds: [],
      assuntoIds: [],
    },
  });

  const { data: loadResult, isLoading, error, reload, setError } = useAsyncResource<LoadResult>(
    { livros: [], autores: [], assuntos: [] },
    async () => {
      const [livros, autores, assuntos] = await Promise.all([listLivros(), listAutores(), listAssuntos()]);
      return { livros, autores, assuntos };
    },
    (e) => toApiError(e).message,
  );

  const modalOpts = useMemo(
    () => ({
      onOpenCreate: () =>
        form.reset({
          titulo: "",
          editora: "",
          edicao: 1,
          anoPublicacao: "",
          valor: 0,
          autorIds: [],
          assuntoIds: [],
        }),
      onOpenEdit: (livro: Livro) =>
        form.reset({
          titulo: livro.titulo,
          editora: livro.editora,
          edicao: livro.edicao,
          anoPublicacao: livro.anoPublicacao,
          valor: livro.valor,
          autorIds: livro.autores.map((autor) => autor.codAu),
          assuntoIds: livro.assuntos.map((assunto) => assunto.codAs),
        }),
    }),
    [form],
  );

  const modal = useCrudModal<Livro>(modalOpts);
  const confirmDialog = useConfirmDialog<Livro>();

  const handleCreateClick = useCallback(() => {
    modal.openCreate();
  }, [modal]);

  const handleEditClick = useCallback(
    (livro: Livro) => {
      modal.openEdit(livro);
    },
    [modal],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      setError(null);
      try {
        if (modal.editingItem) {
          await updateLivro(modal.editingItem.codl, values);
        } else {
          await createLivro(values);
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
    (livro: Livro) => {
      confirmDialog.request(livro);
    },
    [confirmDialog],
  );

  const handleDeleteConfirm = useCallback(
    async (livro: Livro) => {
      setError(null);
      try {
        await deleteLivro(livro.codl);
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
    loadResult,
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

