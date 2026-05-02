export type Livro = {
  codl: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  autores: { codAu: number; nome: string }[];
  assuntos: { codAs: number; descricao: string }[];
};

export type CreateLivroBody = {
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  autorIds: number[];
  assuntoIds: number[];
};

export type UpdateLivroBody = CreateLivroBody;

