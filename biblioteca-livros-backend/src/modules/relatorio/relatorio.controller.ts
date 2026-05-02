import type { Request, Response } from "express";
import { formatRelatorioCsv } from "./relatorio-csv.js";
import { relatorioService } from "./relatorio.service.js";

export class RelatorioController {
  constructor(private readonly service = relatorioService) {}

  livrosPorAutor = async (_req: Request, res: Response) => {
    const data = await this.service.getLivrosPorAutor();
    res.json({ agrupadoPor: "autor", itens: data });
  };

  livrosPorAutorCsv = async (_req: Request, res: Response) => {
    const data = await this.service.getLivrosPorAutor();
    const csv = formatRelatorioCsv(data);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="relatorio-livros-por-autor.csv"',
    );
    res.send(csv);
  };
}

export const relatorioController = new RelatorioController();
