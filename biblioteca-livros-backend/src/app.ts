import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./core/middleware/error-handler.js";
import { livroRoutes } from "./modules/livro/livro.routes.js";
import { autorRoutes } from "./modules/autor/autor.routes.js";
import { assuntoRoutes } from "./modules/assunto/assunto.routes.js";
import { relatorioRoutes } from "./modules/relatorio/relatorio.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/livros", livroRoutes);
  app.use("/autores", autorRoutes);
  app.use("/assuntos", assuntoRoutes);
  app.use("/relatorios", relatorioRoutes);

  app.use(errorHandler);
  return app;
}
