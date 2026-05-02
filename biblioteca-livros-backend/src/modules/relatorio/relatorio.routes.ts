import { Router } from "express";
import { relatorioController } from "./relatorio.controller.js";

const router = Router();

router.get("/livros-por-autor", relatorioController.livrosPorAutor);
router.get("/livros-por-autor/csv", relatorioController.livrosPorAutorCsv);

export { router as relatorioRoutes };
