import { NotFoundError } from "../../core/errors/not-found-error.js";
import type { CreateAssuntoBody, UpdateAssuntoBody } from "./assunto.schemas.js";
import { assuntoRepository } from "./assunto.repository.js";

export class AssuntoService {
  constructor(private readonly repo = assuntoRepository) {}

  list() {
    return this.repo.findAll();
  }

  async getById(codAs: number) {
    const assunto = await this.repo.findById(codAs);
    if (!assunto) {
      throw new NotFoundError("Assunto não encontrado.");
    }
    return assunto;
  }

  create(body: CreateAssuntoBody) {
    return this.repo.create({ descricao: body.descricao });
  }

  async update(codAs: number, body: UpdateAssuntoBody) {
    await this.getById(codAs);
    return this.repo.update(codAs, { descricao: body.descricao });
  }

  async remove(codAs: number) {
    await this.getById(codAs);
    return this.repo.delete(codAs);
  }
}

export const assuntoService = new AssuntoService();
