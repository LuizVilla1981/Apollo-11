-- Registros do Publico
--
-- Como usar:
-- 1. Abra o SQL Editor do projeto Supabase conectado ao site.
-- 2. Execute este arquivo inteiro.
-- 3. Depois confirme no painel se o bucket `public-records` foi criado.

create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('public-records', 'public-records', true)
on conflict (id) do update
set public = excluded.public,
    name = excluded.name;

create table if not exists public.public_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  event_date date null,
  city text null,
  venue text null,
  name text null,
  instagram text null,
  message text null,
  file_path text not null,
  file_url text not null,
  file_type text not null,
  mime_type text null,
  approved boolean default true,
  consent_repost boolean default false
);

alter table public.public_records enable row level security;

drop policy if exists public_records_insert_public on public.public_records;
create policy public_records_insert_public on public.public_records
for insert
to public
with check (true);

drop policy if exists public_records_select_approved on public.public_records;
create policy public_records_select_approved on public.public_records
for select
to public
using (approved = true);

drop policy if exists public_records_update_service_role on public.public_records;
create policy public_records_update_service_role on public.public_records
for update
to service_role
using (true)
with check (true);

drop policy if exists public_records_delete_service_role on public.public_records;
create policy public_records_delete_service_role on public.public_records
for delete
to service_role
using (true);

drop policy if exists storage_public_records_insert_public on storage.objects;
create policy storage_public_records_insert_public on storage.objects
for insert
to public
with check (bucket_id = 'public-records');

drop policy if exists storage_public_records_select_public on storage.objects;
create policy storage_public_records_select_public on storage.objects
for select
to public
using (bucket_id = 'public-records');

comment on table public.public_records is 'Envios publicos de fotos e videos do publico para a galeria da banda.';