import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";

const livroInclude = {
  livroAutores: { include: { autor: true } },
  livroAssuntos: { include: { assunto: true } },
} satisfies Prisma.LivroInclude;

export class LivroRepository {
  private client(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  findAll(tx?: Prisma.TransactionClient) {
    return this.client(tx).livro.findMany({
      orderBy: { titulo: "asc" },
      include: livroInclude,
    });
  }

  findById(codl: number, tx?: Prisma.TransactionClient) {
    return this.client(tx).livro.findUnique({
      where: { codl },
      include: livroInclude,
    });
  }

  deleteById(codl: number, tx?: Prisma.TransactionClient) {
    return this.client(tx).livro.delete({ where: { codl } });
  }

  deleteJunctionsForLivro(codl: number, tx: Prisma.TransactionClient) {
    return Promise.all([
      tx.livroAutor.deleteMany({ where: { livroCodl: codl } }),
      tx.livroAssunto.deleteMany({ where: { livroCodl: codl } }),
    ]);
  }

  createJunctions(
    livroCodl: number,
    autorIds: number[],
    assuntoIds: number[],
    tx: Prisma.TransactionClient,
  ) {
    return Promise.all([
      tx.livroAutor.createMany({
        data: autorIds.map((autorCodAu) => ({
          livroCodl,
          autorCodAu,
        })),
      }),
      tx.livroAssunto.createMany({
        data: assuntoIds.map((assuntoCodAs) => ({
          livroCodl,
          assuntoCodAs,
        })),
      }),
    ]);
  }
}

export const livroRepository = new LivroRepository();
