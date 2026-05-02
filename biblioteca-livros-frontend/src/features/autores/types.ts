export type Autor = {
  codAu: number;
  nome: string;
};

export type CreateAutorBody = {
  nome: string;
};

export type UpdateAutorBody = CreateAutorBody;

