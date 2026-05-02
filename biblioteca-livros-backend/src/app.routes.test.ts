import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";

const mockLivroService = vi.hoisted(() => ({
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

const mockAutorService = vi.hoisted(() => ({
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

const mockAssuntoService = vi.hoisted(() => ({
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

const mockRelatorioService = vi.hoisted(() => ({
  getLivrosPorAutor: vi.fn(),
}));

vi.mock("./modules/livro/livro.service.js", () => ({
  livroService: mockLivroService,
}));
vi.mock("./modules/autor/autor.service.js", () => ({
  autorService: mockAutorService,
}));
vi.mock("./modules/assunto/assunto.service.js", () => ({
  assuntoService: mockAssuntoService,
}));
vi.mock("./modules/relatorio/relatorio.service.js", () => ({
  relatorioService: mockRelatorioService,
}));

import { createApp } from "./app.js";

describe("routes (supertest)", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /livros should return list", async () => {
    mockLivroService.list.mockResolvedValue([{ codl: 1 }]);
    const res = await request(app).get("/livros");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ codl: 1 }]);
  });

  it("GET /autores/:id should validate params and call service", async () => {
    mockAutorService.getById.mockResolvedValue({ codAu: 1, nome: "A" });
    const res = await request(app).get("/autores/1");
    expect(res.status).toBe(200);
    expect(mockAutorService.getById).toHaveBeenCalledWith(1);

    const bad = await request(app).get("/autores/0");
    expect(bad.status).toBe(400);
  });

  it("POST /assuntos should validate body", async () => {
    mockAssuntoService.create.mockResolvedValue({ codAs: 1, descricao: "X" });
    const res = await request(app).post("/assuntos").send({ descricao: "X" });
    expect(res.status).toBe(201);
    expect(mockAssuntoService.create).toHaveBeenCalledWith({ descricao: "X" });

    const bad = await request(app).post("/assuntos").send({ descricao: "" });
    expect(bad.status).toBe(400);
  });

  it("GET /relatorios/livros-por-autor should return report JSON", async () => {
    mockRelatorioService.getLivrosPorAutor.mockResolvedValue([
      {
        codAutor: 1,
        nomeAutor: "A",
        codLivro: 2,
        titulo: "T",
        editora: "E",
        edicao: 1,
        anoPublicacao: "2000",
        valor: 10,
        assuntos: "",
      },
    ]);
    const res = await request(app).get("/relatorios/livros-por-autor");
    expect(res.status).toBe(200);
    expect(res.body.agrupadoPor).toBe("autor");
    expect(res.body.itens).toHaveLength(1);
  });

  it("GET /relatorios/livros-por-autor/csv should return CSV attachment", async () => {
    mockRelatorioService.getLivrosPorAutor.mockResolvedValue([]);
    const res = await request(app).get("/relatorios/livros-por-autor/csv");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain("attachment;");
  });
});

