import { NotFoundError } from "../../core/errors/not-found-error.js";
import type { CreateAutorBody, UpdateAutorBody } from "./autor.schemas.js";
import { autorRepository } from "./autor.repository.js";

export class AutorService {
  constructor(private readonly repo = autorRepository) {}

  list() {
    return this.repo.findAll();
  }

  async getById(codAu: number) {
    const autor = await this.repo.findById(codAu);
    if (!autor) {
      throw new NotFoundError("Autor não encontrado.");
    }
    return autor;
  }

  create(body: CreateAutorBody) {
    return this.repo.create({ nome: body.nome });
  }

  async update(codAu: number, body: UpdateAutorBody) {
    await this.getById(codAu);
    return this.repo.update(codAu, { nome: body.nome });
  }

  async remove(codAu: number) {
    await this.getById(codAu);
    return this.repo.delete(codAu);
  }
}

export const autorService = new AutorService();
