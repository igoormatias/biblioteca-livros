import { describe, it, expect, vi, beforeEach } from "vitest";
import { RelatorioService } from "./relatorio.service.js";

const repo = vi.hoisted(() => ({
  findLivrosPorAutor: vi.fn(),
}));

vi.mock("./relatorio.repository.js", () => ({
  relatorioRepository: repo,
}));

describe("RelatorioService", () => {
  let service: RelatorioService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RelatorioService();
  });

  it("should map raw view rows to camelCase and numeric valor", async () => {
    vi.mocked(repo.findLivrosPorAutor).mockResolvedValue([
      {
        cod_autor: 1,
        nome_autor: "A",
        cod_livro: 2,
        titulo: "T",
        editora: "E",
        edicao: 3,
        ano_publicacao: "1999",
        valor: { toNumber: () => 12.34 },
        assuntos: "X, Y",
      },
    ]);
    const out = await service.getLivrosPorAutor();
    expect(out).toEqual([
      {
        codAutor: 1,
        nomeAutor: "A",
        codLivro: 2,
        titulo: "T",
        editora: "E",
        edicao: 3,
        anoPublicacao: "1999",
        valor: 12.34,
        assuntos: "X, Y",
      },
    ]);
  });

  it("should coerce plain numeric valor with Number()", async () => {
    vi.mocked(repo.findLivrosPorAutor).mockResolvedValue([
      {
        cod_autor: 1,
        nome_autor: "A",
        cod_livro: 2,
        titulo: "T",
        editora: "E",
        edicao: 1,
        ano_publicacao: "2000",
        valor: "50",
        assuntos: "",
      },
    ]);
    const out = await service.getLivrosPorAutor();
    expect(out[0].valor).toBe(50);
  });

  it("should fallback valor to 0 when coercion is not finite", async () => {
    vi.mocked(repo.findLivrosPorAutor).mockResolvedValue([
      {
        cod_autor: 1,
        nome_autor: "A",
        cod_livro: 2,
        titulo: "T",
        editora: "E",
        edicao: 1,
        ano_publicacao: "2000",
        valor: "NaN",
        assuntos: "",
      },
    ]);
    const out = await service.getLivrosPorAutor();
    expect(out[0].valor).toBe(0);
  });
});
