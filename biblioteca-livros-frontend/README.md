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

O mapeamento **requisito ↔ implementação** está na tabela do [**README da raiz**](../README.md#requisitos-e-implementação-checklist). Neste projeto: **Tailwind** + variáveis CSS (o enunciado cita **Bootstrap** como *diferencial*); moeda com `CurrencyInput`; relatório com dados da **VIEW** via API; erros com `toApiError`; testes com `npm test`.

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

## Troubleshooting

Ver secção [Troubleshooting](../README.md#troubleshooting) no README da raiz do monorepo.
