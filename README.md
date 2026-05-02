# Cadastro de Livros — Monorepo

Projeto **Web** de cadastro de livros, autores e assuntos (relacionamentos **N:N**), com **relatório por autor** alimentado por **VIEW** no PostgreSQL, API REST em Node e SPA em React.

Este repositório agrupa:

| Pasta | Conteúdo | Documentação |
|-------|----------|--------------|
| `biblioteca-livros-backend` | API REST, Prisma, migrations, seed, exportação **CSV** do relatório | [README do backend](biblioteca-livros-backend/README.md) |
| `biblioteca-livros-frontend` | React (Vite), UI, formatação de moeda, relatório na tela, **PDF** | [README do frontend](biblioteca-livros-frontend/README.md) |

---

## Enunciado do desafio (resumo)

Conforme o teste técnico:

- **Objetivo:** aplicar boas práticas de mercado e apresentar o projeto na entrevista (base de dados, tecnologias, aplicação, metodologias, frameworks).
- **Stack Web** à escolha do candidato, incluindo banco e camada de persistência.
- **CRUD** de **Livro**, **Autor** e **Assunto** de acordo com o **modelo de dados** (ver abaixo).
- **Tela inicial** com menu simples ou links diretos.
- **Modelo de dados** respeitado de forma integral, salvo ajustes justificáveis de performance.
- **Interface** simples, com **CSS** controlando no mínimo cor e tamanho (no enunciado, **Bootstrap** é citado como *diferencial*; neste projeto usamos **Tailwind CSS** com tokens globais, no mesmo espírito).
- **Formatação** em campos que a pedem (ex.: **moeda** no livro).
- **Relatório obrigatório** cujos dados vêm de uma **VIEW** no banco; o “componente de relatório” no contexto Web é a **tela de relatório** + exportações; a consulta SQL fica na VIEW.
- **Agrupamento por autor**, atendendo a livros com **mais de um autor** (a VIEW produz linhas por par autor–livro; a UI agrupa por autor).
- **TDD** como *diferencial* (testes com **Vitest** no backend e no frontend).
- **Tratamento de erros** com mensagens claras; no backend, erros de validação, de negócio e códigos **Prisma** mapeados de forma específica (evitando respostas genéricas desnecessárias).
- Inclusão do campo **valor (R$)** no **Livro** (não estava no diagrama base).
- **Scripts e instruções de implantação** versionados (este README + READMEs por pasta + `prisma/migrations`).

**Apresentação:** o teste é discutido na entrevista técnica (funcional e técnico). Use a secção [Roteiro sugerido para a demo](#roteiro-sugerido-para-a-demo) abaixo.

---

## Modelo de dados (diagrama)

Entidades principais e junções (chaves e tipos alinhados ao enunciado):

- **Livro** — `Codl` (PK), `Titulo`, `Editora`, `Edicao`, `AnoPublicacao`, **`Valor`** (R$, acrescentado ao modelo base).
- **Autor** — `CodAu` (PK), `Nome`.
- **Assunto** — `codAs` (PK), `Descricao`.
- **Livro_Autor** — `Livro_Codl` (FK), `Autor_CodAu` (FK): relação **N:N** livro ↔ autor.
- **Livro_Assunto** — `Livro_Codl` (FK), `Assunto_codAs` (FK): relação **N:N** livro ↔ assunto.

Implementação: [`biblioteca-livros-backend/prisma/schema.prisma`](biblioteca-livros-backend/prisma/schema.prisma) e migrations em [`biblioteca-livros-backend/prisma/migrations/`](biblioteca-livros-backend/prisma/migrations/).

---

## Como rodar (desenvolvimento)

### Pré-requisitos

- **Node.js 20+**
- **Docker Desktop** (para subir o PostgreSQL via `docker compose` do backend)

### 1) Backend

Na pasta `biblioteca-livros-backend`:

```bash
copy .env.example .env
npm install
npm run db:up
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

Por padrão a API fica em `http://localhost:3000` (ajustável via `PORT` no `.env`). O Postgres do Docker mapeia **`127.0.0.1:5433`** no hospedeiro — ver comentários em `.env.example`.

### 2) Frontend

Na pasta `biblioteca-livros-frontend`:

```bash
copy .env.example .env
npm install
npm run dev
```

`VITE_API_BASE_URL` deve apontar para a API (ex.: `http://localhost:3000`). Detalhes: [README do frontend](biblioteca-livros-frontend/README.md).

---

## Requisitos × implementação (checklist)

| Requisito | Onde está coberto |
|-----------|-------------------|
| CRUD Livro, Autor, Assunto | Rotas `/livros`, `/autores`, `/assuntos` + telas correspondentes |
| Menu / links na entrada | `HomePage` e rotas no frontend |
| Modelo + valor R$ | Schema Prisma + `CurrencyInput` no formulário de livro |
| Relatório com dados da VIEW | `vw_relatorio_livros_por_autor` + `GET /relatorios/livros-por-autor` |
| Agrupar por autor (vários autores por livro) | VIEW com uma linha por autor–livro; UI agrupa por autor |
| Exportação / relatório utilizável | Lista na SPA + CSV (API) + PDF (`@react-pdf/renderer`) |
| CSS estruturado | Tailwind + variáveis CSS (cores, tipografia, espaçamento) |
| Erros tratados | Middleware de erro no backend; `toApiError` no frontend |
| Testes (TDD como diferencial) | `npm test` em ambos os projetos |
| Scripts de implantação | Docker compose, Prisma migrate/seed, READMEs |

---

## Roteiro sugerido para a demo

1. Mostrar estrutura do monorepo e o `.env.example` do backend (sem segredos reais).
2. Abrir `prisma/migrations`: tabelas, FKs, junções e **VIEW** do relatório.
3. `npm run prisma:deploy` e `npm run prisma:seed` (ou mostrar base já populada).
4. Subir API (`npm run dev` no backend) e SPA no frontend; percorrer CRUD e relatório.
5. Demonstrar `GET /relatorios/livros-por-autor`, download **CSV** e **PDF** na UI.
6. Executar `npm test` (e opcionalmente `npm run lint`) nos dois projetos.

Sugestões adicionais específicas do backend: [README do backend — apresentação](biblioteca-livros-backend/README.md#sugestão-de-roteiro-para-a-apresentação-entrevista).

---

## Licença

ISC — ver `package.json` em cada subprojeto.
