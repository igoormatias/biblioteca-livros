import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, FieldError, FieldLabel, Input, Modal, PageTitle, Table, TableEmpty, Td, Th } from "../../../components";
import { useAutoresPage } from "./hooks/useAutoresPage";

export function AutoresPage() {
  const {
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
    handleConfirmDeleteClick,
  } = useAutoresPage();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Autores"
        subtitle="Cadastre e mantenha os autores associados aos livros da biblioteca."
        right={
          <Button onClick={handleCreateClick} disabled={isLoading}>
            <Plus className="h-4 w-4" aria-hidden />
            Novo autor
          </Button>
        }
      />

      {error ? <div className="rounded-md border border-border bg-surface p-3 text-sm text-danger">{error}</div> : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <div>
            <CardTitle>Lista</CardTitle>
          </div>
          <p className="text-sm text-muted">Total: {autores.length}</p>
        </CardHeader>
        <CardContent>
          {autores.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum autor cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table>
                <thead>
                  <tr className="border-b border-border">
                    <Th>Código</Th>
                    <Th>Nome</Th>
                    <Th className="text-right">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {autores.map((autor) => (
                    <tr key={autor.codAu} className="border-b border-border last:border-0">
                      <Td className="text-muted">{autor.codAu}</Td>
                      <Td>{autor.nome}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(autor)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Editar autor ${autor.nome}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(autor)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Remover autor ${autor.nome}`}
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
        title={modal.editingItem ? "Editar autor" : "Novo autor"}
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
      >
        <form className="space-y-3" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="space-y-1">
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input id="nome" placeholder="Ex.: Machado de Assis" {...form.register("nome")} />
            <FieldError>{form.formState.errors.nome?.message}</FieldError>
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
          Remover autor <span className="font-medium text-text">{confirmDialog.pending?.nome}</span>?
        </p>
      </Modal>
    </div>
  );
}

