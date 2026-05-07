import { User } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageTitle,
  Table,
  TableEmpty,
  Td,
  Th,
} from "../../../components";
import { formatBRL } from "../../livros/utils/currency";
import { obrasEncontradasLabel, useRelatorioPage } from "./hooks/useRelatorioPage";

export function RelatorioPage() {
  const { data, grouped, loading, error, totalObras, handleDownloadCsv, handleDownloadPdf } = useRelatorioPage();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Relatório por autor"
        subtitle="Acervo agrupado por autor, com exportação para CSV ou PDF."
        right={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
            {!loading && totalObras > 0 ? (
              <Badge variant="primary" role="status">
                {obrasEncontradasLabel(totalObras)}
              </Badge>
            ) : null}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => void handleDownloadCsv()} disabled={loading || data.length === 0}>
                Baixar CSV
              </Button>
              <Button variant="primary" onClick={() => void handleDownloadPdf()} disabled={loading || data.length === 0}>
                Gerar PDF
              </Button>
            </div>
          </div>
        }
      />

      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      {grouped.length === 0 && !loading ? (
        <TableEmpty>Nenhum dado no relatório. (Dica: rode o seed no backend.)</TableEmpty>
      ) : (
        <div className="space-y-4">
          {grouped.map((g) => (
            <Card key={g.autorCodAu}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                  >
                    <User className="h-4 w-4" />
                  </span>
                  <CardTitle className="truncate">{g.autorNome}</CardTitle>
                </div>
                <Badge variant="primary" role="status" className="shrink-0">
                  {obrasEncontradasLabel(g.itens.length)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table className="min-w-[900px] table-fixed">
                    <thead>
                      <tr className="border-b border-border/60">
                        <Th className="w-[28%]">Título</Th>
                        <Th className="w-[18%]">Editora</Th>
                        <Th className="w-[8%]">Edição</Th>
                        <Th className="w-[10%]">Ano</Th>
                        <Th className="w-[12%] text-right">Valor (R$)</Th>
                        <Th className="w-[24%]">Assuntos</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.itens.map((i) => (
                        <tr
                          key={`${i.codAutor}-${i.codLivro}`}
                          className="border-b border-border/60 last:border-0 transition-colors duration-200 hover:bg-bg/50"
                        >
                          <Td className="w-[28%] font-medium text-text">{i.titulo}</Td>
                          <Td className="w-[18%]">{i.editora}</Td>
                          <Td className="w-[8%] whitespace-nowrap">{i.edicao}</Td>
                          <Td className="w-[10%] whitespace-nowrap">{i.anoPublicacao}</Td>
                          <Td className="w-[12%] whitespace-nowrap text-right text-base font-semibold tabular-nums text-text">
                            {formatBRL(i.valor)}
                          </Td>
                          <Td className="w-[24%] text-muted">{i.assuntos}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

