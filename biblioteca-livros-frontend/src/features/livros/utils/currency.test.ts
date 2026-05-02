import { describe, expect, it } from "vitest";
import { formatBRL, parseBRL } from "./currency";

describe("currency utils", () => {
  it("should parse BRL formatted strings", () => {
    expect(parseBRL("R$ 1.234,56")).toBeCloseTo(1234.56);
    expect(parseBRL("1234,56")).toBeCloseTo(1234.56);
    expect(parseBRL("1234.56")).toBeCloseTo(1234.56);
  });

  it("should format BRL values", () => {
    expect(formatBRL(0)).toContain("R$");
    expect(formatBRL(1234.56)).toContain("1.234");
  });
});

