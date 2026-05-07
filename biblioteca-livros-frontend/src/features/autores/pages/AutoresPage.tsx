import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FieldError,
  FieldLabel,
  Input,
  Modal,
  PageTitle,
  RowActionButton,
  Table,
  TableEmpty,
  Td,
  Th,
} from "../../../components";
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
    <div className="space-y-8">
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

      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>Lista</CardTitle>
          <Badge>
            {autores.length} {autores.length === 1 ? "autor" : "autores"}
          </Badge>
        </CardHeader>
        <CardContent>
          {autores.length === 0 && !isLoading ? (
            <TableEmpty>Nenhum autor cadastrado.</TableEmpty>
          ) : (
            <div className="overflow-auto">
              <Table>
                <thead>
                  <tr className="border-b border-border/60">
                    <Th>Código</Th>
                    <Th>Nome</Th>
                    <Th className="text-right">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {autores.map((autor) => (
                    <tr
                      key={autor.codAu}
                      className="border-b border-border/60 last:border-0 transition-colors duration-200 hover:bg-bg/50"
                    >
                      <Td className="text-muted">{autor.codAu}</Td>
                      <Td className="font-medium text-text">{autor.nome}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <RowActionButton
                            variant="edit"
                            onClick={() => handleEditClick(autor)}
                            aria-label={`Editar autor ${autor.nome}`}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </RowActionButton>
                          <RowActionButton
                            variant="delete"
                            onClick={() => handleDeleteClick(autor)}
                            aria-label={`Remover autor ${autor.nome}`}
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

