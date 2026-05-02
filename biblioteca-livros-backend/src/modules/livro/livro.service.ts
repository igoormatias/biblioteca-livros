import { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { NotFoundError } from "../../core/errors/not-found-error.js";
import type { CreateLivroBody, UpdateLivroBody } from "./livro.schemas.js";
import { livroRepository } from "./livro.repository.js";
import { mapLivroToResponse, type LivroResponse } from "./livro.mapper.js";

export class LivroService {
  constructor(private readonly repo = livroRepository) {}

  async list(): Promise<LivroResponse[]> {
    const rows = await this.repo.findAll();
    return rows.map(mapLivroToResponse);
  }

  async getById(codl: number): Promise<LivroResponse> {
    const livro = await this.repo.findById(codl);
    if (!livro) {
      throw new NotFoundError("Livro não encontrado.");
    }
    return mapLivroToResponse(livro);
  }

  async create(body: CreateLivroBody): Promise<LivroResponse> {
    const livro = await prisma.$transaction(async (tx) => {
      const created = await tx.livro.create({
        data: {
          titulo: body.titulo,
          editora: body.editora,
          edicao: body.edicao,
          anoPublicacao: body.anoPublicacao,
          valor: body.valor,
        },
      });
      await this.repo.createJunctions(created.codl, body.autorIds, body.assuntoIds, tx);
      const full = await this.repo.findById(created.codl, tx);
      if (!full) {
        throw new NotFoundError("Livro não encontrado após criação.");
      }
      return full;
    });
    return mapLivroToResponse(livro);
  }

  async update(codl: number, body: UpdateLivroBody): Promise<LivroResponse> {
    const existing = await this.repo.findById(codl);
    if (!existing) {
      throw new NotFoundError("Livro não encontrado.");
    }

    const livro = await prisma.$transaction(async (tx) => {
      await this.repo.deleteJunctionsForLivro(codl, tx);
      await tx.livro.update({
        where: { codl },
        data: {
          titulo: body.titulo,
          editora: body.editora,
          edicao: body.edicao,
          anoPublicacao: body.anoPublicacao,
          valor: body.valor,
        },
      });
      await this.repo.createJunctions(codl, body.autorIds, body.assuntoIds, tx);
      const full = await this.repo.findById(codl, tx);
      if (!full) {
        throw new NotFoundError("Livro não encontrado após atualização.");
      }
      return full;
    });
    return mapLivroToResponse(livro);
  }

  async remove(codl: number): Promise<void> {
    try {
      await this.repo.deleteById(codl);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        throw new NotFoundError("Livro não encontrado.");
      }
      throw err;
    }
  }
}

export const livroService = new LivroService();
