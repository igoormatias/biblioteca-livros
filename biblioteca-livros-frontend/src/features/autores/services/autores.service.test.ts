import { describe, expect, it, vi } from "vitest";

vi.mock("../../../services/http", () => ({
  http: {
    get: vi.fn(async () => ({ data: [{ codAu: 1, nome: "Teste" }] })),
  },
}));

import { listAutores } from "./autores.service";

describe("autores.service", () => {
  it("should list autores", async () => {
    const res = await listAutores();
    expect(res).toEqual([{ codAu: 1, nome: "Teste" }]);
  });
});

