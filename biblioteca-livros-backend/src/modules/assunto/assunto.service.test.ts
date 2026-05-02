import { describe, expect, it, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../core/errors/not-found-error.js";
import { AssuntoService } from "./assunto.service.js";
import type { AssuntoRepository } from "./assunto.repository.js";

describe("AssuntoService", () => {
  const repo: Pick<
    AssuntoRepository,
    "findById" | "findAll" | "create" | "update" | "delete"
  > = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  let service: AssuntoService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AssuntoService(repo as AssuntoRepository);
  });

  it("should throw NotFoundError when getById finds no assunto", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    await expect(service.getById(99)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should delegate list to repository", async () => {
    vi.mocked(repo.findAll).mockResolvedValue([]);
    await expect(service.list()).resolves.toEqual([]);
  });

  it("should delegate create to repository", async () => {
    const row = { codAs: 1, descricao: "D" };
    vi.mocked(repo.create).mockResolvedValue(row);
    await expect(service.create({ descricao: "D" })).resolves.toEqual(row);
  });

  it("should load entity then update via repository", async () => {
    vi.mocked(repo.findById).mockResolvedValue({ codAs: 1, descricao: "a" });
    vi.mocked(repo.update).mockResolvedValue({ codAs: 1, descricao: "b" });
    await expect(service.update(1, { descricao: "b" })).resolves.toEqual({
      codAs: 1,
      descricao: "b",
    });
  });

  it("should load entity then delete via repository", async () => {
    vi.mocked(repo.findById).mockResolvedValue({ codAs: 1, descricao: "a" });
    vi.mocked(repo.delete).mockResolvedValue({ codAs: 1, descricao: "a" });
    await expect(service.remove(1)).resolves.toEqual({
      codAs: 1,
      descricao: "a",
    });
  });
});
