import { Router } from "express";
import { idParamSchema } from "../../core/schemas/params.js";
import { validateBody, validateParams } from "../../core/middleware/validate.js";
import { assuntoController } from "./assunto.controller.js";
import { createAssuntoBodySchema, updateAssuntoBodySchema } from "./assunto.schemas.js";

const router = Router();

router.get("/", assuntoController.list);
router.get("/:id", validateParams(idParamSchema), assuntoController.getById);
router.post("/", validateBody(createAssuntoBodySchema), assuntoController.create);
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateAssuntoBodySchema),
  assuntoController.update,
);
router.delete("/:id", validateParams(idParamSchema), assuntoController.remove);

export { router as assuntoRoutes };
