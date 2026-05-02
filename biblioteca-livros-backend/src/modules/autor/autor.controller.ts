import type { Request, RequestHandler, Response } from "express";
import { autorService } from "./autor.service.js";

export class AutorController {
  constructor(private readonly service = autorService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.service.list();
    res.json(data);
  };

  getById: RequestHandler = async (req, res) => {
    const id = (req.params as unknown as { id: number }).id;
    const data = await this.service.getById(id);
    res.json(data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(data);
  };

  update: RequestHandler = async (req, res) => {
    const id = (req.params as unknown as { id: number }).id;
    const data = await this.service.update(id, req.body);
    res.json(data);
  };

  remove: RequestHandler = async (req, res) => {
    const id = (req.params as unknown as { id: number }).id;
    await this.service.remove(id);
    res.status(204).send();
  };
}

export const autorController = new AutorController();
