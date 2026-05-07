import { Controller } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CurrencyInput,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  Modal,
  MultiSelect,
  PageTitle,
  RowActionButton,
  Table,
  TableEmpty,
  Td,
  Th,
} from "../../../components";
import { useLivrosPage } from "./hooks/useLivrosPage";
import { formatBRL } from "../utils/currency";

export function LivrosPage() {
  const {
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
    handleConfirmDeleteClick,
  } = useLivrosPage();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Livros"
        subtitle="Consulte e cadastre obras com valor, dados editoriais e vínculos com autores e assuntos."
        right={
          <Button onClick={handleCreateClick} disabled={isLoading}>
            <Plus className="h-4 w-4" aria-hidden />
            Novo livro
          </Button>
        }
      />

      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>Lista</CardTitle>
          <Badge>
            {loadResult.livros.length} {loadResult.livros.length === 1 ? "livro" : "livros"}
          </Badge>
        </CardHeader>
        <CardContent>
          {loadResult.livros.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum livro cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table className="min-w-[900px]">
                <thead>
                  <tr className="border-b border-border/60">
                    <Th>Código</Th>
                    <Th>Título</Th>
                    <Th>Editora</Th>
                    <Th>Edição</Th>
                    <Th>Ano</Th>
                    <Th className="text-right">Valor</Th>
                    <Th>Autores</Th>
                    <Th>Assuntos</Th>
                    <Th className="text-right">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {loadResult.livros.map((livro) => (
                    <tr
                      key={livro.codl}
                      className="border-b border-border/60 last:border-0 transition-colors duration-200 hover:bg-bg/50"
                    >
                      <Td className="text-muted">{livro.codl}</Td>
                      <Td className="font-medium text-text">{livro.titulo}</Td>
                      <Td>{livro.editora}</Td>
                      <Td>{livro.edicao}</Td>
                      <Td>{livro.anoPublicacao}</Td>
                      <Td className="text-right tabular-nums">{formatBRL(livro.valor)}</Td>
                      <Td className="text-muted">{livro.autores.map((autor) => autor.nome).join(", ")}</Td>
                      <Td className="text-muted">{livro.assuntos.map((assunto) => assunto.descricao).join(", ")}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <RowActionButton
                            variant="edit"
                            onClick={() => handleEditClick(livro)}
                            aria-label={`Editar livro ${livro.titulo}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </RowActionButton>
                          <RowActionButton
                            variant="delete"
                            onClick={() => handleDeleteClick(livro)}
                            aria-label={`Remover livro ${livro.titulo}`}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </RowActionButton>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modal.isOpen}
        onClose={modal.close}
        title={modal.editingItem ? "Editar livro" : "Novo livro"}
        footer={
          <>
            <Button variant="ghost" onClick={modal.close}>
              Cancelar
            </Button>
            <Button onClick={form.handleSubmit(handleFormSubmit)} isLoading={form.formState.isSubmitting}>
              Salvar
            </Button>
          </>
        }
        className="max-w-3xl"
      >
        <form className="space-y-6" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input id="titulo" placeholder="Ex.: Dom Casmurro" {...form.register("titulo")} />
              <FieldError>{form.formState.errors.titulo?.message}</FieldError>
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="editora">Editora</FieldLabel>
              <Input id="editora" placeholder="Ex.: Garnier" {...form.register("editora")} />
              <FieldError>{form.formState.errors.editora?.message}</FieldError>
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="anoPublicacao">Ano de publicação</FieldLabel>
              <Input id="anoPublicacao" placeholder="YYYY" maxLength={4} {...form.register("anoPublicacao")} />
              <FieldHint>4 dígitos (ex.: 1899)</FieldHint>
              <FieldError>{form.formState.errors.anoPublicacao?.message}</FieldError>
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="edicao">Edição</FieldLabel>
              <Input id="edicao" type="number" min={1} step={1} {...form.register("edicao", { valueAsNumber: true })} />
              <FieldError>{form.formState.errors.edicao?.message}</FieldError>
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="valor">Valor</FieldLabel>
              <Controller
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <CurrencyInput id="valor" value={Number(field.value) || 0} onChange={field.onChange} />
                )}
              />
              <FieldError>{form.formState.errors.valor?.message}</FieldError>
            </div>
          </div>

          <div className="h-px bg-border/60" aria-hidden />

          <div className="space-y-4">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="autores">Autores</FieldLabel>
              <Controller
                control={form.control}
                name="autorIds"
                render={({ field }) => (
                  <MultiSelect
                    id="autores"
                    options={loadResult.autores.map((autor) => ({ value: autor.codAu, label: autor.nome }))}
                    values={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um ou mais autores"
                    searchPlaceholder="Buscar autor..."
                    emptyText="Nenhum autor encontrado."
                    invalid={!!form.formState.errors.autorIds}
                  />
                )}
              />
              <FieldError>{form.formState.errors.autorIds?.message}</FieldError>
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="assuntos">Assuntos</FieldLabel>
              <Controller
                control={form.control}
                name="assuntoIds"
                render={({ field }) => (
                  <MultiSelect
                    id="assuntos"
                    options={loadResult.assuntos.map((assunto) => ({
                      value: assunto.codAs,
                      label: assunto.descricao,
                    }))}
                    values={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um ou mais assuntos"
                    searchPlaceholder="Buscar assunto..."
                    emptyText="Nenhum assunto encontrado."
                    invalid={!!form.formState.errors.assuntoIds}
                  />
                )}
              />
              <FieldError>{form.formState.errors.assuntoIds?.message}</FieldError>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDialog.pending}
        onClose={confirmDialog.cancel}
        title="Confirmar remoção"
        footer={
          <>
            <Button variant="ghost" onClick={confirmDialog.cancel}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteClick}>
              Remover
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-text">
            Remover livro <span className="font-medium">{`"${confirmDialog.pending?.titulo ?? ""}"`}</span>?
          </p>
          <p className="text-xs leading-relaxed text-muted">Esta ação não pode ser desfeita.</p>
        </div>
      </Modal>
    </div>
  );
}

