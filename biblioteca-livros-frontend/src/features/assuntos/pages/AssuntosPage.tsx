import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button } from "../../../components";
import { Card, CardContent, CardHeader, CardTitle, PageTitle } from "../../../components/Card";
import { FieldError, FieldLabel, Input } from "../../../components/Field";
import { Modal } from "../../../components/Modal";
import { RowActionButton, Table, TableEmpty, Td, Th } from "../../../components/Table";
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
    <div className="space-y-8">
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

      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>Lista</CardTitle>
          <Badge>
            {assuntos.length} {assuntos.length === 1 ? "assunto" : "assuntos"}
          </Badge>
        </CardHeader>
        <CardContent>
          {assuntos.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum assunto cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table>
                <thead>
                  <tr className="border-b border-border/60">
                    <Th>Código</Th>
                    <Th>Descrição</Th>
                    <Th className="text-right">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {assuntos.map((assunto) => (
                    <tr
                      key={assunto.codAs}
                      className="border-b border-border/60 last:border-0 transition-colors duration-200 hover:bg-bg/50"
                    >
                      <Td className="text-muted">{assunto.codAs}</Td>
                      <Td className="font-medium text-text">{assunto.descricao}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <RowActionButton
                            variant="edit"
                            onClick={() => handleEditClick(assunto)}
                            aria-label={`Editar assunto ${assunto.descricao}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </RowActionButton>
                          <RowActionButton
                            variant="delete"
                            onClick={() => handleDeleteClick(assunto)}
                            aria-label={`Remover assunto ${assunto.descricao}`}
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
        title={modal.editingItem ? "Editar assunto" : "Novo assunto"}
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
            Remover assunto <span className="font-medium">{`"${confirmDialog.pending?.descricao ?? ""}"`}</span>?
          </p>
          <p className="text-xs leading-relaxed text-muted">Esta ação não pode ser desfeita.</p>
        </div>
      </Modal>
    </div>
  );
}

