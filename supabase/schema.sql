-- Products table and RLS policies for WarrantyIT take-home
-- Run this in your Supabase SQL Editor for your project.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text not null,
  type text not null,
  warranty_months integer not null check (warranty_months >= 0),
  start_date date not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_products_user on public.products(user_id);
create index if not exists idx_products_created on public.products(created_at desc);
-- Optimized composite index for common access pattern: WHERE user_id ORDER BY created_at DESC
create index if not exists idx_products_user_created on public.products(user_id, created_at desc);
-- Optional: if you later query by start_date per user (e.g., upcoming expiries)
create index if not exists idx_products_user_start_date on public.products(user_id, start_date);
-- Index for ordering by expiry date per user (for upcoming expiries)
create index if not exists idx_products_user_expiry on public.products(user_id, expiry_date asc);

-- Enable RLS
alter table public.products enable row level security;
