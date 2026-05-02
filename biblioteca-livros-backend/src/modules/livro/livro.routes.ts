import { Router } from "express";
import { idParamSchema } from "../../core/schemas/params.js";
import { validateBody, validateParams } from "../../core/middleware/validate.js";
import { livroController } from "./livro.controller.js";
import { createLivroBodySchema, updateLivroBodySchema } from "./livro.schemas.js";

const router = Router();

router.get("/", livroController.list);
router.get("/:id", validateParams(idParamSchema), livroController.getById);
router.post("/", validateBody(createLivroBodySchema), livroController.create);
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateLivroBodySchema),
  livroController.update,
);
router.delete("/:id", validateParams(idParamSchema), livroController.remove);

export { router as livroRoutes };
