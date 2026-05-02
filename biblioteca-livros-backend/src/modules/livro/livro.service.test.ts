import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../core/errors/not-found-error.js";
import type { LivroWithRelations } from "./livro.mapper.js";

type MockTx = {
  livro: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mock$transaction = vi.fn();

vi.mock("../../core/prisma.js", () => ({
  prisma: {
    $transaction: (fn: (tx: MockTx) => Promise<unknown>) => mock$transaction(fn),
  },
}));

const repo = vi.hoisted(() => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  deleteById: vi.fn(),
  deleteJunctionsForLivro: vi.fn(),
  createJunctions: vi.fn(),
}));

vi.mock("./livro.repository.js", () => ({
  livroRepository: repo,
}));

import { LivroService } from "./livro.service.js";

function makeLivroFull(over?: Partial<LivroWithRelations>): LivroWithRelations {
  return {
    codl: 1,
    titulo: "Livro",
    editora: "Ed",
    edicao: 1,
    anoPublicacao: "2000",
    valor: { toNumber: () => 42.5 } as LivroWithRelations["valor"],
    livroAutores: [
      {
        livroCodl: 1,
        autorCodAu: 1,
        autor: { codAu: 1, nome: "Autor" },
      },
    ],
    livroAssuntos: [
      {
        livroCodl: 1,
        assuntoCodAs: 1,
        assunto: { codAs: 1, descricao: "Tema" },
      },
    ],
    ...over,
  } as LivroWithRelations;
}

describe("LivroService", () => {
  let service: LivroService;
  let mockTx: MockTx;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LivroService();
    mockTx = {
      livro: {
        create: vi.fn(),
        update: vi.fn(),
      },
    };
    mock$transaction.mockImplementation(async (fn: (tx: MockTx) => Promise<unknown>) =>
      fn(mockTx),
    );
  });

  it("should map list results including nested relations", async () => {
    const full = makeLivroFull();
    vi.mocked(repo.findAll).mockResolvedValue([full]);
    const out = await service.list();
    expect(out).toHaveLength(1);
    expect(out[0].codl).toBe(1);
    expect(out[0].valor).toBe(42.5);
    expect(out[0].autores[0].nome).toBe("Autor");
  });

  it("should throw NotFoundError when getById finds no row", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    await expect(service.getById(9)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should return mapped livro when getById finds a row", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeLivroFull());
    const out = await service.getById(1);
    expect(out.titulo).toBe("Livro");
  });

  it("should run transaction and return mapped livro on create", async () => {
    vi.mocked(mockTx.livro.create).mockResolvedValue({ codl: 1 });
    vi.mocked(repo.findById).mockResolvedValue(makeLivroFull());
    const body = {
      titulo: "N",
      editora: "E",
      edicao: 1,
      anoPublicacao: "2001",
      valor: 10,
      autorIds: [1],
      assuntoIds: [2],
    };
    const out = await service.create(body);
    expect(mockTx.livro.create).toHaveBeenCalled();
    expect(repo.createJunctions).toHaveBeenCalledWith(1, [1], [2], mockTx);
    expect(out.codl).toBe(1);
  });

  it("should throw NotFoundError on update when livro does not exist", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    await expect(
      service.update(1, {
        titulo: "N",
        editora: "E",
        edicao: 1,
        anoPublicacao: "2001",
        valor: 1,
        autorIds: [1],
        assuntoIds: [1],
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(mock$transaction).not.toHaveBeenCalled();
  });

  it("should replace junctions and update fields inside a transaction", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeLivroFull());
    await service.update(1, {
      titulo: "Novo",
      editora: "E",
      edicao: 2,
      anoPublicacao: "2002",
      valor: 99,
      autorIds: [1],
      assuntoIds: [1],
    });
    expect(repo.deleteJunctionsForLivro).toHaveBeenCalledWith(1, mockTx);
    expect(mockTx.livro.update).toHaveBeenCalled();
    expect(repo.createJunctions).toHaveBeenCalled();
  });

  it("should call repository deleteById on remove", async () => {
    vi.mocked(repo.deleteById).mockResolvedValue({} as never);
    await service.remove(1);
    expect(repo.deleteById).toHaveBeenCalledWith(1);
  });

  it("should map Prisma P2025 to NotFoundError on remove", async () => {
    const err = new Prisma.PrismaClientKnownRequestError("x", {
      code: "P2025",
      clientVersion: "test",
      meta: {},
    });
    vi.mocked(repo.deleteById).mockRejectedValue(err);
    await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundError);
  });
});
