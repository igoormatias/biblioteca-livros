const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatBRL = (value: number) => brl.format(Number.isFinite(value) ? value : 0);

export const parseBRL = (input: string): number => {
  // Accept: "R$ 1.234,56", "1234,56", "1234.56"
  const raw = input.replace(/\s/g, "").replace(/^R\$/i, "");

  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(/,/g, ".") // pt-BR: '.' thousands, ',' decimal
    : raw.replace(/,/g, ""); // en-like: '.' decimal, ',' thousands (optional)

  const cleaned = normalized.replace(/[^\d.-]/g, "");

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

