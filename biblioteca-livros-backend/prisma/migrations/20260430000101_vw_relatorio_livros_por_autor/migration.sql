CREATE OR REPLACE VIEW vw_relatorio_livros_por_autor AS
SELECT
  a."CodAu" AS cod_autor,
  a."Nome" AS nome_autor,
  l."Codl" AS cod_livro,
  l."Titulo" AS titulo,
  l."Editora" AS editora,
  l."Edicao" AS edicao,
  l."AnoPublicacao" AS ano_publicacao,
  l."Valor" AS valor,
  COALESCE(
    string_agg(DISTINCT s."Descricao", ', ' ORDER BY s."Descricao"),
    ''
  ) AS assuntos
FROM "Autor" a
INNER JOIN "Livro_Autor" la ON la."Autor_CodAu" = a."CodAu"
INNER JOIN "Livro" l ON l."Codl" = la."Livro_Codl"
LEFT JOIN "Livro_Assunto" ls ON ls."Livro_Codl" = l."Codl"
LEFT JOIN "Assunto" s ON s."codAs" = ls."Assunto_codAs"
GROUP BY
  a."CodAu",
  a."Nome",
  l."Codl",
  l."Titulo",
  l."Editora",
  l."Edicao",
  l."AnoPublicacao",
  l."Valor";
