import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import { ConflictError } from "../errors/conflict-error.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationRequestError } from "../errors/validation-request-error.js";

function prismaMessage(meta: Record<string, unknown> | undefined): string | undefined {
  if (!meta) return undefined;
  const cause = meta["cause"];
  if (typeof cause === "string") return cause;
  const fieldName = meta["field_name"];
  if (typeof fieldName === "string") {
    return `Violação de integridade: ${fieldName}.`;
  }
  return undefined;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          message: "Registro duplicado.",
          code: "CONFLICT",
          meta: err.meta,
        });
        return;
      case "P2003": {
        const msg =
          prismaMessage(err.meta) ??
          "Referência inválida: registro relacionado não existe.";
        res.status(400).json({
          message: msg,
          code: "FOREIGN_KEY_VIOLATION",
          meta: err.meta,
        });
        return;
      }
      case "P2025":
        res.status(404).json({
          message: "Registro não encontrado.",
          code: "NOT_FOUND",
        });
        return;
      default:
        break;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      message: "Dados inválidos para o banco de dados.",
      code: "PRISMA_VALIDATION",
    });
    return;
  }

  if (err instanceof ValidationRequestError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      fields: err.fields,
    });
    return;
  }

  if (err instanceof NotFoundError || err instanceof ConflictError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: "Erro interno do servidor.",
    code: "INTERNAL_ERROR",
  });
};
