# Apollo 11 — Rock, Pop Rock e MPB

Landing page do trio Apollo 11, de Itajubá, MG.

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · motion/react · Supabase

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com suas variáveis Supabase
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase |

## Banco de dados

Execute os SQLs em `supabase/` no SQL Editor do Supabase:

- `schema.sql` — tabelas `booking_requests`, `song_suggestions`, `ig_requests`
- `public_records.sql` — tabela `public_records` + bucket de storage

## Deploy

Hospedado na Vercel. O `vercel.json` já configura SPA rewrite e headers de cache.
