import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, PageTitle } from "../../../components";

export function HomePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Início" subtitle="Atalhos para o cadastro do acervo e relatórios." />

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
              Gerencie livros (com vários autores e assuntos), a lista de autores e os temas do catálogo.
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
              Veja obras agrupadas por autor e exporte o relatório para CSV ou PDF.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

