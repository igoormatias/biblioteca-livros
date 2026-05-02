import { describe, expect, it, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../core/errors/not-found-error.js";
import { AutorService } from "./autor.service.js";
import type { AutorRepository } from "./autor.repository.js";

describe("AutorService", () => {
  const repo: Pick<
    AutorRepository,
    "findById" | "findAll" | "create" | "update" | "delete"
  > = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  let service: AutorService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AutorService(repo as AutorRepository);
  });

  it("should throw NotFoundError when getById finds no autor", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    await expect(service.getById(99)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should return autor when getById finds a row", async () => {
    const autor = { codAu: 1, nome: "Nome" };
    vi.mocked(repo.findById).mockResolvedValue(autor);
    await expect(service.getById(1)).resolves.toEqual(autor);
  });

  it("should delegate list to repository", async () => {
    vi.mocked(repo.findAll).mockResolvedValue([]);
    await expect(service.list()).resolves.toEqual([]);
  });

  it("should delegate create to repository", async () => {
    const row = { codAu: 2, nome: "Novo" };
    vi.mocked(repo.create).mockResolvedValue(row);
    await expect(service.create({ nome: "Novo" })).resolves.toEqual(row);
  });

  it("should load entity then update via repository", async () => {
    vi.mocked(repo.findById).mockResolvedValue({ codAu: 1, nome: "a" });
    vi.mocked(repo.update).mockResolvedValue({ codAu: 1, nome: "b" });
    await expect(service.update(1, { nome: "b" })).resolves.toEqual({
      codAu: 1,
      nome: "b",
    });
  });

  it("should load entity then delete via repository", async () => {
    vi.mocked(repo.findById).mockResolvedValue({ codAu: 1, nome: "a" });
    vi.mocked(repo.delete).mockResolvedValue({ codAu: 1, nome: "a" });
    await expect(service.remove(1)).resolves.toEqual({ codAu: 1, nome: "a" });
  });
});
