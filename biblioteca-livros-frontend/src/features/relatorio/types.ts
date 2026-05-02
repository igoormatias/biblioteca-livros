export type RelatorioLivroPorAutorItem = {
  codAutor: number;
  nomeAutor: string;
  codLivro: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  assuntos: string;
};

export type RelatorioLivroPorAutorResponse = {
  agrupadoPor: "autor";
  itens: RelatorioLivroPorAutorItem[];
};

