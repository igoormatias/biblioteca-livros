import type { Prisma } from "@prisma/client";

export type LivroWithRelations = Prisma.LivroGetPayload<{
  include: {
    livroAutores: { include: { autor: true } };
    livroAssuntos: { include: { assunto: true } };
  };
}>;

export type LivroResponse = {
  codl: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  autores: { codAu: number; nome: string }[];
  assuntos: { codAs: number; descricao: string }[];
};

export function mapLivroToResponse(livro: LivroWithRelations): LivroResponse {
  return {
    codl: livro.codl,
    titulo: livro.titulo,
    editora: livro.editora,
    edicao: livro.edicao,
    anoPublicacao: livro.anoPublicacao,
    valor: livro.valor.toNumber(),
    autores: livro.livroAutores.map((la) => ({
      codAu: la.autor.codAu,
      nome: la.autor.nome,
    })),
    assuntos: livro.livroAssuntos.map((ls) => ({
      codAs: ls.assunto.codAs,
      descricao: ls.assunto.descricao,
    })),
  };
}
