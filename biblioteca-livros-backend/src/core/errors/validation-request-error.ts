import type { ZodError } from "zod";
import { AppError } from "./app-error.js";

export type FieldErrors = Record<string, string[] | undefined>;

export class ValidationRequestError extends AppError {
  readonly fields?: FieldErrors;

  constructor(messageOrError: string | ZodError, fields?: FieldErrors) {
    if (typeof messageOrError === "string") {
      super(messageOrError, 400, "VALIDATION_ERROR");
      this.fields = fields;
    } else {
      super("Dados inválidos.", 400, "VALIDATION_ERROR");
      this.fields = messageOrError.flatten().fieldErrors as FieldErrors;
    }
    this.name = "ValidationRequestError";
  }
}
