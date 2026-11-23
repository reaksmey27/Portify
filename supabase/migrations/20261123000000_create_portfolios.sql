create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text unique not null,
  category text,
  description text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  template_id text not null default 'minimal',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolios enable row level security;

create policy "Users can view their portfolios"
on public.portfolios for select
using (auth.uid() = user_id);

create policy "Users can create their portfolios"
on public.portfolios for insert
with check (auth.uid() = user_id);

create policy "Users can update their portfolios"
on public.portfolios for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their portfolios"
on public.portfolios for delete
using (auth.uid() = user_id);

create or replace function public.update_portfolio_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolios_updated_at
before update on public.portfolios
for each row
execute function public.update_portfolio_updated_at();
