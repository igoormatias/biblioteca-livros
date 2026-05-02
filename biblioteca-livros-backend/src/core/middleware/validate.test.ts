import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateBody, validateParams } from "./validate.js";
import { ValidationRequestError } from "../errors/validation-request-error.js";
import { idParamSchema } from "../schemas/params.js";

describe("validateBody", () => {
  const schema = z.object({
    nome: z.string().min(1),
  });

  it("should assign parsed body and call next with no error", () => {
    const mw = validateBody(schema);
    const req = { body: { nome: "ok" } };
    const next = vi.fn();
    mw(req as never, {} as never, next);
    expect(req.body).toEqual({ nome: "ok" });
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with ValidationRequestError when body is invalid", () => {
    const mw = validateBody(schema);
    const req = { body: { nome: "" } };
    const next = vi.fn();
    mw(req as never, {} as never, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ValidationRequestError));
  });
});

describe("validateParams", () => {
  it("should coerce string id to positive number in params", () => {
    const mw = validateParams(idParamSchema);
    const req = { params: { id: "7" } };
    const next = vi.fn();
    mw(req as never, {} as never, next);
    expect(req.params).toEqual({ id: 7 });
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with ValidationRequestError when id is invalid", () => {
    const mw = validateParams(idParamSchema);
    const req = { params: { id: "0" } };
    const next = vi.fn();
    mw(req as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationRequestError));
  });
});
