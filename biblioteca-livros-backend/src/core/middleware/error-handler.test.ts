import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Prisma } from "@prisma/client";
import { errorHandler } from "./error-handler.js";
import { AppError } from "../errors/app-error.js";
import { ConflictError } from "../errors/conflict-error.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationRequestError } from "../errors/validation-request-error.js";

describe("errorHandler", () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    headersSent: false,
  };
  const next = vi.fn();
  const req = {} as never;

  beforeEach(() => {
    vi.clearAllMocks();
    res.headersSent = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should respond with 409 when Prisma code is P2002", () => {
    const err = new Prisma.PrismaClientKnownRequestError("dup", {
      code: "P2002",
      clientVersion: "t",
      meta: { target: ["x"] },
    });
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "CONFLICT" }),
    );
  });

  it("should respond with 400 FOREIGN_KEY_VIOLATION when Prisma code is P2003", () => {
    const err = new Prisma.PrismaClientKnownRequestError("fk", {
      code: "P2003",
      clientVersion: "t",
      meta: { field_name: "Livro_Codl" },
    });
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "FOREIGN_KEY_VIOLATION" }),
    );
  });

  it("should respond with 404 when Prisma code is P2025", () => {
    const err = new Prisma.PrismaClientKnownRequestError("nf", {
      code: "P2025",
      clientVersion: "t",
      meta: {},
    });
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should respond with 400 PRISMA_VALIDATION for PrismaClientValidationError", () => {
    const err = new Prisma.PrismaClientValidationError("bad", { clientVersion: "t" });
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "PRISMA_VALIDATION" }),
    );
  });

  it("should respond with 400 and fields for ValidationRequestError", () => {
    const err = new ValidationRequestError("invalid", { nome: ["required"] });
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "VALIDATION_ERROR",
        fields: { nome: ["required"] },
      }),
    );
  });

  it("should respond with 404 for NotFoundError", () => {
    errorHandler(new NotFoundError("n"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should respond with 409 for ConflictError", () => {
    errorHandler(new ConflictError("c"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("should use status code from generic AppError", () => {
    errorHandler(new AppError("m", 418), req, res, next);
    expect(res.status).toHaveBeenCalledWith(418);
  });

  it("should respond with 500 and log unknown errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    errorHandler(new Error("oops"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "INTERNAL_ERROR" }),
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should forward to next when response headers were already sent", () => {
    res.headersSent = true;
    const err = new Error("late");
    errorHandler(err, req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
