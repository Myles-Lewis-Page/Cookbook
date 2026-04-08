-- Run this in your Supabase SQL Editor to set up the recipes table

create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  prep_time text,
  cook_time text,
  servings text,
  all_ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Allow public read access (anyone can view recipes)
alter table recipes enable row level security;

create policy "Public can read recipes"
  on recipes for select
  using (true);

create policy "Service role can insert recipes"
  on recipes for insert
  with check (true);

create policy "Service role can update recipes"
  on recipes for update
  using (true);

create policy "Service role can delete recipes"
  on recipes for delete
  using (true);
