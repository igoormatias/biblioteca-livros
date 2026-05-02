import { useCallback, useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toApiError } from "../../../../../services/apiError";
import { downloadBlob } from "../../../../../services/download";
import { RelatorioPdfDocument } from "../../../pdf/RelatorioPdfDocument";
import { downloadRelatorioLivrosPorAutorCsv, getRelatorioLivrosPorAutor } from "../../../services/relatorio.service";
import type { RelatorioLivroPorAutorItem } from "../../../types";

export type RelatorioGroup = {
  autorCodAu: number;
  autorNome: string;
  itens: RelatorioLivroPorAutorItem[];
};

export const obrasEncontradasLabel = (count: number): string =>
  count === 1 ? "1 obra encontrada" : `${count} obras encontradas`;

export type UseRelatorioPageResult = {
  data: RelatorioLivroPorAutorItem[];
  grouped: RelatorioGroup[];
  loading: boolean;
  error: string | null;
  totalObras: number;
  handleDownloadCsv: () => Promise<void>;
  handleDownloadPdf: () => Promise<void>;
};

export const useRelatorioPage = (): UseRelatorioPageResult => {
  const [data, setData] = useState<RelatorioLivroPorAutorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRelatorioLivrosPorAutor();
      setData(res.itens ?? []);
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const grouped = useMemo<RelatorioGroup[]>(() => {
    const map = new Map<number, { autorNome: string; itens: RelatorioLivroPorAutorItem[] }>();
    for (const item of data) {
      const key = item.codAutor;
      const current = map.get(key);
      if (current) current.itens.push(item);
      else map.set(key, { autorNome: item.nomeAutor, itens: [item] });
    }
    return Array.from(map.entries())
      .map(([autorCodAu, v]) => ({ autorCodAu, ...v }))
      .sort((a, b) => a.autorNome.localeCompare(b.autorNome));
  }, [data]);

  const handleDownloadCsv = useCallback(async () => {
    setError(null);
    try {
      const blob = await downloadRelatorioLivrosPorAutorCsv();
      downloadBlob(blob, "relatorio-livros-por-autor.csv");
    } catch (e) {
      setError(toApiError(e).message);
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    setError(null);
    try {
      const blob = await pdf(<RelatorioPdfDocument groups={grouped} generatedAt={new Date()} />).toBlob();
      downloadBlob(blob, "relatorio-livros-por-autor.pdf");
    } catch (e) {
      setError(toApiError(e).message);
    }
  }, [grouped]);

  return { data, grouped, loading, error, totalObras: data.length, handleDownloadCsv, handleDownloadPdf };
};

