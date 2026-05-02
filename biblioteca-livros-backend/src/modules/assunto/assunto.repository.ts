import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";

export class AssuntoRepository {
  findAll() {
    return prisma.assunto.findMany({ orderBy: { descricao: "asc" } });
  }

  findById(codAs: number) {
    return prisma.assunto.findUnique({ where: { codAs } });
  }

  create(data: Prisma.AssuntoCreateInput) {
    return prisma.assunto.create({ data });
  }

  update(codAs: number, data: Prisma.AssuntoUpdateInput) {
    return prisma.assunto.update({ where: { codAs }, data });
  }

  delete(codAs: number) {
    return prisma.assunto.delete({ where: { codAs } });
  }
}

export const assuntoRepository = new AssuntoRepository();
