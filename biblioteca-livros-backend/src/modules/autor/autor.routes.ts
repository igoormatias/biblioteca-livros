import { Router } from "express";
import { idParamSchema } from "../../core/schemas/params.js";
import { validateBody, validateParams } from "../../core/middleware/validate.js";
import { autorController } from "./autor.controller.js";
import { createAutorBodySchema, updateAutorBodySchema } from "./autor.schemas.js";

const router = Router();

router.get("/", autorController.list);
router.get("/:id", validateParams(idParamSchema), autorController.getById);
router.post("/", validateBody(createAutorBodySchema), autorController.create);
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateAutorBodySchema),
  autorController.update,
);
router.delete("/:id", validateParams(idParamSchema), autorController.remove);

export { router as autorRoutes };
