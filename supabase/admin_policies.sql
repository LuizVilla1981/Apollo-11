-- Políticas de administração para moderação de registros públicos
--
-- Como usar:
-- 1. Primeiro, crie um usuário admin no painel do Supabase:
--    Authentication → Users → Invite user (com email e senha).
-- 2. Abra o SQL Editor do projeto Supabase conectado ao site.
-- 3. Execute este arquivo inteiro.
--
-- Depois disso, acesse /admin no site para logar e moderar os envios.

-- ═══════════════════════════════════════════════════════════════
-- A. Mudar default de approved para false (moderação prévia)
-- ═══════════════════════════════════════════════════════════════
alter table public.public_records
  alter column approved set default false;

-- ═══════════════════════════════════════════════════════════════
-- B. Adicionar coluna status nas tabelas que não tinham
-- ═══════════════════════════════════════════════════════════════
alter table public.booking_requests
  add column if not exists status text default 'pending';

alter table public.song_suggestions
  add column if not exists status text default 'pending';

alter table public.ig_requests
  add column if not exists status text default 'pending';

-- ═══════════════════════════════════════════════════════════════
-- C. Tabela de audit log
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_email text not null,
  action text not null,
  target_table text not null,
  target_id uuid not null,
  details jsonb
);

alter table public.admin_audit_log enable row level security;

drop policy if exists audit_log_insert_authenticated on public.admin_audit_log;
create policy audit_log_insert_authenticated on public.admin_audit_log
for insert
to authenticated
with check (true);

drop policy if exists audit_log_select_authenticated on public.admin_audit_log;
create policy audit_log_select_authenticated on public.admin_audit_log
for select
to authenticated
using (true);

-- ═══════════════════════════════════════════════════════════════
-- D. Policies: public_records (autenticados veem/editam/deletam)
-- ═══════════════════════════════════════════════════════════════
drop policy if exists public_records_select_all_authenticated on public.public_records;
create policy public_records_select_all_authenticated on public.public_records
for select
to authenticated
using (true);

drop policy if exists public_records_update_authenticated on public.public_records;
create policy public_records_update_authenticated on public.public_records
for update
to authenticated
using (true)
with check (true);

drop policy if exists public_records_delete_authenticated on public.public_records;
create policy public_records_delete_authenticated on public.public_records
for delete
to authenticated
using (true);

-- ═══════════════════════════════════════════════════════════════
-- E. Policies: booking_requests (autenticados leem/editam/deletam)
-- ═══════════════════════════════════════════════════════════════
drop policy if exists booking_requests_select_authenticated on public.booking_requests;
create policy booking_requests_select_authenticated on public.booking_requests
for select
to authenticated
using (true);

drop policy if exists booking_requests_update_authenticated on public.booking_requests;
create policy booking_requests_update_authenticated on public.booking_requests
for update
to authenticated
using (true)
with check (true);

drop policy if exists booking_requests_delete_authenticated on public.booking_requests;
create policy booking_requests_delete_authenticated on public.booking_requests
for delete
to authenticated
using (true);

-- ═══════════════════════════════════════════════════════════════
-- F. Policies: song_suggestions (autenticados leem/editam/deletam)
-- ═══════════════════════════════════════════════════════════════
drop policy if exists song_suggestions_select_authenticated on public.song_suggestions;
create policy song_suggestions_select_authenticated on public.song_suggestions
for select
to authenticated
using (true);

drop policy if exists song_suggestions_update_authenticated on public.song_suggestions;
create policy song_suggestions_update_authenticated on public.song_suggestions
for update
to authenticated
using (true)
with check (true);

drop policy if exists song_suggestions_delete_authenticated on public.song_suggestions;
create policy song_suggestions_delete_authenticated on public.song_suggestions
for delete
to authenticated
using (true);

-- ═══════════════════════════════════════════════════════════════
-- G. Policies: ig_requests (autenticados leem/editam/deletam)
-- ═══════════════════════════════════════════════════════════════
drop policy if exists ig_requests_select_authenticated on public.ig_requests;
create policy ig_requests_select_authenticated on public.ig_requests
for select
to authenticated
using (true);

drop policy if exists ig_requests_update_authenticated on public.ig_requests;
create policy ig_requests_update_authenticated on public.ig_requests
for update
to authenticated
using (true)
with check (true);

drop policy if exists ig_requests_delete_authenticated on public.ig_requests;
create policy ig_requests_delete_authenticated on public.ig_requests
for delete
to authenticated
using (true);

-- ═══════════════════════════════════════════════════════════════
-- H. Policies: storage (autenticados deletam arquivos)
-- ═══════════════════════════════════════════════════════════════
drop policy if exists storage_public_records_delete_authenticated on storage.objects;
create policy storage_public_records_delete_authenticated on storage.objects
for delete
to authenticated
using (bucket_id = 'public-records');
