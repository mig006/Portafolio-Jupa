-- Run this script in Supabase SQL Editor.

create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_admins (
  email text primary key
);

alter table public.portfolio_content enable row level security;
alter table public.portfolio_admins enable row level security;

-- Public visitors can read published content.
drop policy if exists "public can read portfolio content" on public.portfolio_content;
create policy "public can read portfolio content"
  on public.portfolio_content
  for select
  to anon, authenticated
  using (true);

-- Only authenticated admin emails can insert new content rows.
drop policy if exists "admins can insert portfolio content" on public.portfolio_content;
create policy "admins can insert portfolio content"
  on public.portfolio_content
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.portfolio_admins admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

-- Only authenticated admin emails can update published content.
drop policy if exists "admins can update portfolio content" on public.portfolio_content;
create policy "admins can update portfolio content"
  on public.portfolio_content
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins admins
      where admins.email = auth.jwt() ->> 'email'
    )
  )
  with check (
    exists (
      select 1
      from public.portfolio_admins admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

-- Hide admin list from anon users.
drop policy if exists "admins can read admin list" on public.portfolio_admins;
create policy "admins can read admin list"
  on public.portfolio_admins
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

-- Add your friend's email as admin (change this value first).
insert into public.portfolio_admins (email)
values ('friend@example.com')
on conflict (email) do nothing;
