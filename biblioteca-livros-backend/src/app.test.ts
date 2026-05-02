import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("createApp", () => {
  const app = createApp();

  it("should return 200 and status ok for GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("should return 400 when POST /livros body fails validation", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "",
      editora: "E",
      edicao: 0,
      anoPublicacao: "99",
      valor: -1,
      autorIds: [],
      assuntoIds: [],
    });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });
});
