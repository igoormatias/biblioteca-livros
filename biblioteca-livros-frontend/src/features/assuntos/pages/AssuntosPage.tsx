import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components";
import { Card, CardContent, CardHeader, CardTitle, PageTitle } from "../../../components/Card";
import { FieldError, FieldLabel, Input } from "../../../components/Field";
import { Modal } from "../../../components/Modal";
import { Table, TableEmpty, Td, Th } from "../../../components/Table";
import { useAssuntosPage } from "./hooks/useAssuntosPage";

export function AssuntosPage() {
  const {
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
    handleConfirmDeleteClick,
  } = useAssuntosPage();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Assuntos"
        subtitle="Defina temas para classificar e localizar livros no catálogo."
        right={
          <Button onClick={handleCreateClick} disabled={isLoading}>
            <Plus className="h-4 w-4" aria-hidden />
            Novo assunto
          </Button>
        }
      />

      {error ? <div className="rounded-md border border-border bg-surface p-3 text-sm text-danger">{error}</div> : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <div>
            <CardTitle>Lista</CardTitle>
          </div>
          <p className="text-sm text-muted">Total: {assuntos.length}</p>
        </CardHeader>
        <CardContent>
          {assuntos.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum assunto cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table>
                <thead>
                  <tr className="border-b border-border">
                    <Th>Código</Th>
                    <Th>Descrição</Th>
                    <Th className="text-right">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {assuntos.map((assunto) => (
                    <tr key={assunto.codAs} className="border-b border-border last:border-0">
                      <Td className="text-muted">{assunto.codAs}</Td>
                      <Td>{assunto.descricao}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(assunto)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Editar assunto ${assunto.descricao}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(assunto)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            aria-label={`Remover assunto ${assunto.descricao}`}
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
        title={modal.editingItem ? "Editar assunto" : "Novo assunto"}
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
            <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
            <Input id="descricao" placeholder="Ex.: Romance" {...form.register("descricao")} />
            <FieldError>{form.formState.errors.descricao?.message}</FieldError>
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
          Remover assunto <span className="font-medium text-text">{confirmDialog.pending?.descricao}</span>?
        </p>
      </Modal>
    </div>
  );
}

