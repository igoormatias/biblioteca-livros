import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";

export class AutorRepository {
  findAll() {
    return prisma.autor.findMany({ orderBy: { nome: "asc" } });
  }

  findById(codAu: number) {
    return prisma.autor.findUnique({ where: { codAu } });
  }

  create(data: Prisma.AutorCreateInput) {
    return prisma.autor.create({ data });
  }

  update(codAu: number, data: Prisma.AutorUpdateInput) {
    return prisma.autor.update({ where: { codAu }, data });
  }

  delete(codAu: number) {
    return prisma.autor.delete({ where: { codAu } });
  }
}

export const autorRepository = new AutorRepository();
