import { describe, expect, it } from "vitest";
import { mapLivroToResponse, type LivroWithRelations } from "./livro.mapper.js";

describe("mapLivroToResponse", () => {
  it("should map decimal valor and nested authors and subjects", () => {
    const livro = {
      codl: 1,
      titulo: "T",
      editora: "E",
      edicao: 1,
      anoPublicacao: "2000",
      valor: { toNumber: () => 10.5 },
      livroAutores: [
        {
          livroCodl: 1,
          autorCodAu: 2,
          autor: { codAu: 2, nome: "Autor" },
        },
      ],
      livroAssuntos: [
        {
          livroCodl: 1,
          assuntoCodAs: 3,
          assunto: { codAs: 3, descricao: "D" },
        },
      ],
    } as unknown as LivroWithRelations;

    const out = mapLivroToResponse(livro);
    expect(out.valor).toBe(10.5);
    expect(out.autores).toEqual([{ codAu: 2, nome: "Autor" }]);
    expect(out.assuntos).toEqual([{ codAs: 3, descricao: "D" }]);
  });
});
