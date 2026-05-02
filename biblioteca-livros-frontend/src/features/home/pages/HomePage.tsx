import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, PageTitle } from "../../../components";

export function HomePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Início" subtitle="Acesso rápido às telas do desafio." />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cadastros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Link to="/livros">
                <Button variant="secondary">Livros</Button>
              </Link>
              <Link to="/autores">
                <Button variant="secondary">Autores</Button>
              </Link>
              <Link to="/assuntos">
                <Button variant="secondary">Assuntos</Button>
              </Link>
            </div>
            <p className="text-sm text-muted">
              CRUD completo para Livro, Autor e Assunto, com relacionamento N:N em Livro.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Link to="/relatorio">
                <Button variant="primary">Ver relatório por autor</Button>
              </Link>
            </div>
            <p className="text-sm text-muted">
              A consulta vem de uma VIEW no banco via API e permite exportar CSV (backend) e PDF (frontend).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

