-- =====================================================
-- Bomb Defusal Route — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

create extension if not exists "uuid-ossp";

-- ─── profiles ───────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  created_at  timestamptz default now()
);  

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─── game_results ───────────────────────────────────
create table if not exists public.game_results (
  id              uuid primary key default uuid_generate_v4(),
  user_id         text default 'guest',
  username        text not null default 'Anonymous Agent',
  level           integer not null check (level between 1 and 3),
  algorithm       text not null,
  score           integer not null default 0,
  path_cost       integer not null default 0,
  time_taken      integer not null default 0,
  nodes_explored  integer not null default 0,
  created_at      timestamptz default now()
);

alter table public.game_results enable row level security;

create policy "Anyone can insert game results"
  on public.game_results for insert with check (true);

create policy "Anyone can read game results"
  on public.game_results for select using (true);

-- ─── Index for Leaderboard ──────────────────────────
create index if not exists idx_game_results_score on public.game_results(score desc);
