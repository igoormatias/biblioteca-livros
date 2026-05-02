# Biblioteca — API (backend)

> **Monorepo:** visão geral do desafio, modelo de dados, checklist do enunciado e como rodar **backend + frontend** — [**README na raiz**](../README.md).

API REST para **cadastro de livros**, **autores** e **assuntos**, com relacionamentos **N:N** (um livro pode ter vários autores e vários assuntos), **valor monetário** por livro e **relatório** alimentado por **VIEW** no PostgreSQL. Projeto preparado para **entrevista técnica** (implantação, decisões de arquitetura e qualidade de código documentadas abaixo).

---

## Objetivo do sistema

Oferecer operações **CRUD** completas nas três entidades principais, manter a integridade referencial das tabelas de junção e expor um **relatório** cujos dados vêm exclusivamente de uma **VIEW** no banco, permitindo análise por autor (incluindo o caso de um livro com múltiplos autores, com uma linha por par autor–livro quando aplicável).

---

## Stack tecnológica

| Camada               | Tecnologia                                | Observação                                                                            |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| Runtime              | **Node.js** (20+ recomendado)             | ES modules (`"type": "module"`).                                                      |
| Linguagem            | **TypeScript** (~6.x)                     | Compilação estrita; saída em `dist/`.                                                 |
| HTTP                 | **Express 5**                             | API JSON, CORS habilitado.                                                            |
| ORM / persistência   | **Prisma 6** + **PostgreSQL 14+**         | Migrations versionadas; `url` no `schema.prisma` (fluxo clássico do Prisma 6).        |
| Validação de entrada | **Zod 4**                                 | Schemas por módulo (`*.schemas.ts`); requisições inválidas retornam 400 com detalhes. |
| Testes               | **Vitest** + **Supertest**                | Testes de serviço (mocks) e de integração leve da aplicação.                          |
| Qualidade            | **ESLint 9** (flat config) + **Prettier** | `eslint-config-prettier` para alinhar com o formatador.                               |
| Execução em dev      | **tsx**                                   | `npm run dev` com recarregamento.                                                     |

---

## Funcionalidades

- **Livros:** criação, leitura (lista e detalhe), atualização e exclusão. O detalhe inclui **autores** e **assuntos** associados. Inclui campo **valor** (R$) persistido como decimal.
- **Autores e assuntos:** CRUD completo, com regras de existência antes de atualizar ou remover.
- **Relacionamentos:** em criação/edição de livro, o cliente envia listas de IDs de autores e assuntos; o backend **substitui** as junções de forma **transacional** (evita estados inconsistentes).
- **Relatório “por autor”:** leitura a partir da VIEW `vw_relatorio_livros_por_autor` (joins e agregação de assuntos no SQL). Endpoint JSON para consumo por SPA; **exportação CSV** no mesmo domínio de dados.
- **Tratamento de erros:** middleware central mapeia erros de validação, `AppError` e códigos **Prisma** (ex.: P2002, P2003, P2025) para respostas HTTP consistentes, sem vazar detalhes internos em 500.
- **Observabilidade básica:** rota `GET /health` para health check.

---

## Arquitetura

Padrão em **camadas** por módulo de negócio:

- **Routes** — definição HTTP e aplicação de middlewares de validação.
- **Controller** — orquestra requisição/resposta, sem lógica de negócio pesada.
- **Service** — regras de negócio e transações.
- **Repository** — acesso a dados (Prisma), encapsulado.

Código transversal em `src/core/` (cliente Prisma, erros, middleware de erro, validação). Cada módulo segue o mesmo desenho em pastas (`routes`, `controller`, `service`, `repository`, `schemas`).

---

## Modelo de dados (resumo)

- **Livro** (`Codl`, título, editora, edição, ano de publicação, **valor**).
- **Autor** (`CodAu`, nome).
- **Assunto** (`codAs`, descrição).
- Tabelas de junção **`Livro_Autor`** e **`Livro_Assunto`** com chaves estrangeiras e índices alinhados ao modelo do desafio.

Definição completa: [`prisma/schema.prisma`](prisma/schema.prisma).  
Scripts versionados: [`prisma/migrations/`](prisma/migrations/).

---

## API — rotas principais

| Método                            | Caminho                            | Descrição                                                                      |
| --------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `GET`                             | `/health`                          | Verificação de disponibilidade.                                                |
| `GET` / `POST` / `PUT` / `DELETE` | `/livros`, `/livros/:id`           | CRUD de livros (corpo validado com autores/assuntos nas operações de escrita). |
| `GET` / `POST` / `PUT` / `DELETE` | `/autores`, `/autores/:id`         | CRUD de autores.                                                               |
| `GET` / `POST` / `PUT` / `DELETE` | `/assuntos`, `/assuntos/:id`       | CRUD de assuntos.                                                              |
| `GET`                             | `/relatorios/livros-por-autor`     | Relatório em **JSON** (dados da VIEW).                                         |
| `GET`                             | `/relatorios/livros-por-autor/csv` | Mesmo conjunto de dados em **CSV** (UTF-8 com BOM, adequado p.ex. ao Excel).   |

Contratos de payload: arquivos `*.schemas.ts` em cada módulo.

---

## Relatório, VIEW e exportação

- A **fonte** do relatório é sempre a **VIEW** `vw_relatorio_livros_por_autor` (definida em migration SQL).
- **CSV** é gerado **no backend** (reutiliza o serviço de relatório; sem duplicar regras no frontend).
- **PDF** fica a cargo do **frontend** (por exemplo, consumir o JSON do relatório e gerar o arquivo com uma biblioteca no browser), evitando dependências pesadas de PDF no servidor e alinhando com a camada de apresentação.

### Formato do CSV (detalhes)

- `Content-Type`: `text/csv; charset=utf-8`
- Inclui **BOM** (`\\uFEFF`) para compatibilidade com Excel/Windows.
- Separador: **vírgula** (`,`), com escaping por aspas quando necessário.
- O campo `valor` sai como **número** (sem `R$`), enquanto a apresentação em BRL fica para o frontend (UI/PDF).

---

## Pré-requisitos

- **Node.js** 20 ou superior (recomendado).
- **PostgreSQL** 14 ou superior, com permissão para criar objetos no schema configurado (ex.: `public`).

### PostgreSQL com Docker (recomendado para desenvolvimento)

O repositório inclui [`docker-compose.yml`](docker-compose.yml): base **`biblioteca_livros`**, usuário **`postgres`**, senha **`biblioteca_dev_local`**. O Postgres do container expõe **`127.0.0.1:5433`** no host (evita conflito se você já tiver um servidor na porta **5432**).

1. Inicie o **Docker Desktop** (Windows/macOS).
2. Na raiz do projeto:

   ```bash
   docker compose up -d
   ```

   Ou: `npm run db:up` (equivalente).

3. Copie [`.env.example`](.env.example) para `.env` e ajuste o `DATABASE_URL` (local ou Docker, ver comentários no arquivo).

4. Com o container em execução: `npm run prisma:deploy` e, opcionalmente, `npm run prisma:seed`.

---

## Configuração e implantação

1. **Variáveis de ambiente**

   ```bash
   copy .env.example .env
   ```

   Por padrão (Docker Compose), o [`.env.example`](.env.example) já aponta para `127.0.0.1:5433/biblioteca_livros`. Ajuste `PORT` se necessário (padrão **3000**).

2. **Dependências e Prisma Client**

   ```bash
   npm install
   npm run prisma:generate
   ```

3. **Banco de dados (tabelas + VIEW)**

   ```bash
   npm run prisma:deploy
   ```

   Em desenvolvimento, pode usar `npm run prisma:migrate` para fluxo interativo de alterações de schema.

4. **Dados de demonstração (opcional)**

   ```bash
   npm run prisma:seed
   ```

5. **Subir a API**

   | Ambiente                     | Comando                                |
   | ---------------------------- | -------------------------------------- |
   | Desenvolvimento (hot reload) | `npm run dev`                          |
   | Compilar                     | `npm run build`                        |
   | Produção                     | `npm start` (executa `dist/server.js`) |

   Base URL local: `http://localhost:3000` (ou a porta definida em `PORT`).

---

## Testes e qualidade

```bash
npm test          # Vitest (unitários / integração leve)
npm run lint      # ESLint
npm run format    # Prettier (salvar)
npm run format:check
```

- Testes de unidade concentram-se em **serviços**, formatação (ex.: CSV) e **middleware** (erro, validação), com **mocks** em dependências externas; `vitest.setup.ts` define `DATABASE_URL` mínima para carregar módulos sem exigir Postgres em todos os casos.
- Descrições dos casos em **inglês**, no estilo **“should …”** (comportamento esperado), nos arquivos `*.test.ts`.

---

## Scripts npm

| Script                    | Descrição                                          |
| ------------------------- | -------------------------------------------------- |
| `dev` / `build` / `start` | Desenvolvimento, compilação e produção.            |
| `test` / `test:watch`     | Suíte de testes Vitest.                            |
| `prisma:generate`         | Gera o Prisma Client.                              |
| `prisma:migrate`          | Migrations em desenvolvimento.                     |
| `prisma:deploy`           | Aplica migrations (CI / produção).                 |
| `prisma:seed`             | Popula dados de exemplo.                           |
| `db:up` / `db:down`       | Sobe / encerra o Postgres do `docker-compose.yml`. |
| `lint` / `lint:fix`       | Análise estática ESLint.                           |
| `format` / `format:check` | Formatação Prettier.                               |

---

## Estrutura do repositório (visão geral)

```text
prisma/                 # schema, migrations, seed
src/
  app.ts                # Fábrica Express (rotas + middleware global)
  server.ts             # Entrada HTTP
  core/                 # Prisma, erros, middlewares compartilhados
  modules/              # livro, autor, assunto, relatorio (por camada)
```

---

## Consistência com o enunciado do desafio

Os requisitos oficiais (CRUD, VIEW no relatório, agrupamento por autor, valor R$, TDD e tratamento de erros) estão mapeados no [**README da raiz**](../README.md). Este arquivo foca a **API**, **Prisma** e **scripts do banco de dados**.

---

## Licença

ISC (ver `package.json`).
