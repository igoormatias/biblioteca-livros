import { Controller } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
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
  PageTitle,
  Select,
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
    <div className="space-y-6">
      <PageTitle
        title="Livros"
        subtitle="CRUD de livros (com autores e assuntos)."
        right={
          <Button onClick={handleCreateClick} disabled={isLoading}>
            <Plus className="h-4 w-4" aria-hidden />
            Novo livro
          </Button>
        }
      />

      {error ? <div className="rounded-md border border-border bg-surface p-3 text-sm text-danger">{error}</div> : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <div>
            <CardTitle>Lista</CardTitle>
          </div>
          <p className="text-sm text-muted">Total: {loadResult.livros.length}</p>
        </CardHeader>
        <CardContent>
          {loadResult.livros.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum livro cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table className="min-w-[900px]">
                <thead>
                  <tr className="border-b border-border">
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
                    <tr key={livro.codl} className="border-b border-border last:border-0">
                      <Td className="text-muted">{livro.codl}</Td>
                      <Td className="font-semibold text-primary">{livro.titulo}</Td>
                      <Td>{livro.editora}</Td>
                      <Td>{livro.edicao}</Td>
                      <Td>{livro.anoPublicacao}</Td>
                      <Td className="text-right tabular-nums">{formatBRL(livro.valor)}</Td>
                      <Td className="text-muted">{livro.autores.map((autor) => autor.nome).join(", ")}</Td>
                      <Td className="text-muted">{livro.assuntos.map((assunto) => assunto.descricao).join(", ")}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(livro)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Editar livro ${livro.titulo}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(livro)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Remover livro ${livro.titulo}`}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
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
            <Button variant="secondary" onClick={modal.close}>
              Cancelar
            </Button>
            <Button onClick={form.handleSubmit(handleFormSubmit)} isLoading={form.formState.isSubmitting}>
              Salvar
            </Button>
          </>
        }
        className="max-w-3xl"
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="space-y-1">
            <FieldLabel htmlFor="titulo">Título</FieldLabel>
            <Input id="titulo" placeholder="Ex.: Dom Casmurro" {...form.register("titulo")} />
            <FieldError>{form.formState.errors.titulo?.message}</FieldError>
          </div>

          <div className="space-y-1">
            <FieldLabel htmlFor="editora">Editora</FieldLabel>
            <Input id="editora" placeholder="Ex.: Garnier" {...form.register("editora")} />
            <FieldError>{form.formState.errors.editora?.message}</FieldError>
          </div>

          <div className="space-y-1">
            <FieldLabel htmlFor="edicao">Edição</FieldLabel>
            <Input id="edicao" type="number" min={1} step={1} {...form.register("edicao", { valueAsNumber: true })} />
            <FieldError>{form.formState.errors.edicao?.message}</FieldError>
          </div>

          <div className="space-y-1">
            <FieldLabel htmlFor="anoPublicacao">Ano de publicação</FieldLabel>
            <Input id="anoPublicacao" placeholder="YYYY" maxLength={4} {...form.register("anoPublicacao")} />
            <FieldHint>4 dígitos (ex.: 1899)</FieldHint>
            <FieldError>{form.formState.errors.anoPublicacao?.message}</FieldError>
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1 md:col-span-2">
            <FieldLabel>Autores</FieldLabel>
            <Controller
              control={form.control}
              name="autorIds"
              render={({ field }) => (
                <Select
                  multiple
                  value={field.value.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.currentTarget.selectedOptions).map((o) => Number(o.value));
                    field.onChange(selected);
                  }}
                  className="h-28"
                >
                  {loadResult.autores.map((autor) => (
                    <option key={autor.codAu} value={autor.codAu}>
                      {autor.nome}
                    </option>
                  ))}
                </Select>
              )}
            />
            <FieldHint>Ctrl/Shift para selecionar múltiplos.</FieldHint>
            <FieldError>{form.formState.errors.autorIds?.message}</FieldError>
          </div>

          <div className="space-y-1 md:col-span-2">
            <FieldLabel>Assuntos</FieldLabel>
            <Controller
              control={form.control}
              name="assuntoIds"
              render={({ field }) => (
                <Select
                  multiple
                  value={field.value.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.currentTarget.selectedOptions).map((o) => Number(o.value));
                    field.onChange(selected);
                  }}
                  className="h-28"
                >
                  {loadResult.assuntos.map((assunto) => (
                    <option key={assunto.codAs} value={assunto.codAs}>
                      {assunto.descricao}
                    </option>
                  ))}
                </Select>
              )}
            />
            <FieldHint>Ctrl/Shift para selecionar múltiplos.</FieldHint>
            <FieldError>{form.formState.errors.assuntoIds?.message}</FieldError>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDialog.pending}
        onClose={confirmDialog.cancel}
        title="Confirmar remoção"
        footer={
          <>
            <Button variant="secondary" onClick={confirmDialog.cancel}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteClick}>
              Remover
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Remover livro <span className="font-medium text-text">{confirmDialog.pending?.titulo}</span>?
        </p>
      </Modal>
    </div>
  );
}

