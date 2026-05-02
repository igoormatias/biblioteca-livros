import { AppError } from "./app-error.js";

export class ConflictError extends AppError {
  constructor(message = "Conflito ao persistir os dados.") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}
