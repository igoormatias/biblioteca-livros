export type Assunto = {
  codAs: number;
  descricao: string;
};

export type CreateAssuntoBody = {
  descricao: string;
};

export type UpdateAssuntoBody = CreateAssuntoBody;

