# Biblioteca — Frontend (React)

> **Monorepo:** instruções completas (enunciado, modelo de dados, como subir backend + frontend) estão no [**README na raiz**](../README.md).

Frontend web do desafio **Cadastro de Livros**, consumindo a API do backend.

- **CRUD**: Livro, Autor e Assunto
- **Relatório**: livros por autor (dados vindos de uma **VIEW** no banco via API)
- **Exportações**:
  - **CSV**: download direto do backend
  - **PDF**: gerado no frontend com `@react-pdf/renderer`

---

## Stack

- **React + TypeScript** (Vite)
- **Tailwind CSS** (tokens globais via CSS variables — atende ao pedido de CSS que controle cor e tamanho; o enunciado cita **Bootstrap** como *diferencial*; aqui a escolha foi Tailwind por consistência e produtividade)
- **Axios** (requests)
- **React Hook Form + Zod** (forms + validação)
- **Vitest + Testing Library** (testes)

---

## Pré-requisitos

- Node.js 20+ (recomendado)
- Backend em execução (ver abaixo)

---

## Como rodar (backend + frontend)

Segue o passo a passo no [**README da raiz do repositório**](../README.md#como-rodar-desenvolvimento). Resumo:

1. Subir **PostgreSQL** (Docker) e a **API** em `../biblioteca-livros-backend` (`npm run db:up`, `prisma:deploy`, `prisma:seed`, `npm run dev`).
2. Nesta pasta: `copy .env.example .env`, `npm install`, `npm run dev`.

O backend sobe por padrão em `http://localhost:3000`.

---

## Configuração de API

O frontend usa `VITE_API_BASE_URL`:

- `.env.example`:
  - `VITE_API_BASE_URL=http://localhost:3000`

Se mudares a porta do backend, ajusta o `.env` do frontend.

---

## Telas

- **Início**: menu simples com links
- **Livros**: listagem + criar/editar/remover (com seleção múltipla de autores/assuntos e valor em R$)
- **Autores**: CRUD
- **Assuntos**: CRUD
- **Relatório por autor**: agrupado por autor, com botões de exportação CSV/PDF

---

## Requisitos do desafio (checklist)

Alinhamento ao enunciado oficial (cadastro Web, modelo de dados, apresentação na entrevista):

- **CRUD completo** para **Livro**, **Autor** e **Assunto** conforme o modelo (incluindo junções **Livro_Autor** e **Livro_Assunto**).
- **Tela inicial** com menu simples / links para as telas.
- **Modelo seguido integralmente**, com o campo extra **`valor (R$)`** no livro e formatação de **moeda** na digitação (`CurrencyInput`).
- **Interface** simples com **CSS** a controlar cor e tamanho (Tailwind + variáveis CSS; o texto do desafio menciona **Bootstrap** como *diferencial*).
- **Relatório obrigatório** com consulta a uma **VIEW** no banco (consumida via API); na Web, o relatório é a **página dedicada** + exportações **CSV** (backend) e **PDF** (`@react-pdf/renderer`). Dados das três entidades principais, **agrupados por autor**, com suporte a **vários autores por livro** (dados normalizados na VIEW; agrupamento na UI).
- **Tratamento de erros** com mensagens utilizáveis (`toApiError` + feedback nas páginas); no servidor, erros específicos de validação e de persistência (ver backend).
- **TDD** como *diferencial*: **Vitest** + Testing Library (`npm test`).
- **Scripts e instruções de implantação** na raiz do monorepo e neste README.

Complementos úteis na entrevista (backend): **Docker** para o Postgres, **migrations** versionadas, rotas e contratos em schemas **Zod**. Ver [README da raiz](../README.md).

---

## Scripts úteis

```bash
npm run dev
npm run build
npm run preview
npm test
```

---

## Arquitetura do frontend

- **Feature-based** em `src/features/*` (cada domínio isolado: `livros`, `autores`, `assuntos`, `relatorio`, `home`).
- **Componentes globais** em `src/components/*` (com `index.ts` agregador).
- **Hooks compartilhados** em `src/hooks/*` (cada hook com sua pasta + teste + `index.ts`).
- **Services globais** em `src/services/*` (HTTP, downloads, mapeamento de erros).

### Convenção: lógica vs UI (hooks por page)

- **Hooks internos de página** (page-specific) ficam dentro do feature:
  - `src/features/<feature>/pages/hooks/<hookName>/`
  - com `<hookName>.ts|.tsx`, `index.ts` e `<hookName>.test.tsx`
- `src/hooks/` é reservado a hooks **compartilhados** entre features.

---

## Barrel exports (imports mais simples)

- Cada feature possui um `index.ts` exportando a API pública (pages/types/services/utils conforme aplicável).
- A raiz `src/features/index.ts` re-exporta todas as features, permitindo imports curtos:

```ts
import { AssuntosPage, AutoresPage, HomePage, LivrosPage, RelatorioPage } from "./features/index.ts";
```

---

## Qualidade (lint/format/test)

```bash
npm run lint
npm test
```

---

## Troubleshooting rápido

- **Erro de rede/CORS**: confirme o `VITE_API_BASE_URL` no `.env` do frontend.
- **Relatório vazio**: rode `npm run prisma:seed` no backend (o relatório depende da VIEW + dados).
