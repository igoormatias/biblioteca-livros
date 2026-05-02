import { describe, expect, it } from "vitest";
import { createLivroBodySchema } from "./livro.schemas.js";

describe("livro.schemas", () => {
  it("should reject duplicated ids in autorIds/assuntoIds", () => {
    const res = createLivroBodySchema.safeParse({
      titulo: "T",
      editora: "E",
      edicao: 1,
      anoPublicacao: "2000",
      valor: 0,
      autorIds: [1, 1],
      assuntoIds: [2, 2],
    });

    expect(res.success).toBe(false);
  });
});

