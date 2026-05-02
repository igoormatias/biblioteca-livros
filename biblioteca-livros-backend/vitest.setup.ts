import "dotenv/config";

if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL =
    "postgresql://user:pass@127.0.0.1:5432/biblioteca_vitest?schema=public";
}
