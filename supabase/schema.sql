-- Schema completo — Apollo 11 Site
-- Execute no SQL Editor do Supabase para criar todas as tabelas.

create extension if not exists pgcrypto;

-- ============================================================
-- 1. booking_requests
-- ============================================================
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  event_date date not null,
  city text not null,
  event_type text not null,
  duration text not null,
  venue_has_sound_light boolean not null,
  contact_whatsapp text not null,
  formation_preference text not null,
  notes text
);

alter table public.booking_requests enable row level security;

drop policy if exists booking_requests_insert_public on public.booking_requests;
create policy booking_requests_insert_public on public.booking_requests
  for insert to public with check (true);

-- ============================================================
-- 2. song_suggestions
-- ============================================================
create table if not exists public.song_suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  song_name text not null,
  artist text not null,
  spotify_link text,
  suggested_by text
);

alter table public.song_suggestions enable row level security;

drop policy if exists song_suggestions_insert_public on public.song_suggestions;
create policy song_suggestions_insert_public on public.song_suggestions
  for insert to public with check (true);

-- ============================================================
-- 3. ig_requests
-- ============================================================
create table if not exists public.ig_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  request_type text not null,
  message text not null,
  name text
);

alter table public.ig_requests enable row level security;

drop policy if exists ig_requests_insert_public on public.ig_requests;
create policy ig_requests_insert_public on public.ig_requests
  for insert to public with check (true);