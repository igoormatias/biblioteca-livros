import { describe, it, expect, vi, beforeEach } from "vitest";

const queryRaw = vi.fn();

vi.mock("../../core/prisma.js", () => ({
  prisma: {
    $queryRaw: (...args: unknown[]) => queryRaw(...args),
  },
}));

import { RelatorioRepository } from "./relatorio.repository.js";

describe("RelatorioRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call prisma.$queryRaw when loading report rows", async () => {
    queryRaw.mockResolvedValue([]);
    const repo = new RelatorioRepository();
    await repo.findLivrosPorAutor();
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });
});
