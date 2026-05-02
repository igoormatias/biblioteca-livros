import type { AxiosError } from "axios";

export type ApiError =
  | { kind: "network"; message: string }
  | { kind: "timeout"; message: string }
  | { kind: "http"; status: number; message: string; details?: unknown };

const isAxiosError = (error: unknown): error is AxiosError =>
  typeof error === "object" && error !== null && "isAxiosError" in error;

export const toApiError = (error: unknown): ApiError => {
  if (!isAxiosError(error)) {
    return { kind: "network", message: "Erro inesperado." };
  }

  if (error.code === "ECONNABORTED") {
    return { kind: "timeout", message: "Tempo excedido ao comunicar com a API." };
  }

  if (!error.response) {
    return { kind: "network", message: "Não foi possível conectar à API." };
  }

  const status = error.response.status;
  const responseBody = error.response.data as unknown;
  const message =
    (typeof (responseBody as any)?.message === "string" && (responseBody as any).message) ||
    (typeof (responseBody as any)?.error === "string" && (responseBody as any).error) ||
    `Erro HTTP ${status}.`;

  return { kind: "http", status, message, details: responseBody };
};

