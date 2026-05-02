import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { ValidationRequestError } from "../errors/validation-request-error.js";

export function validateBody<S extends ZodSchema>(schema: S): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new ValidationRequestError(result.error));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams<S extends ZodSchema>(schema: S): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(new ValidationRequestError(result.error));
      return;
    }
    req.params = result.data as typeof req.params;
    next();
  };
}
