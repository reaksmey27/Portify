create table if not exists public.portfolio_views (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  visitor_id text not null,
  viewed_at timestamptz not null default now()
);

alter table public.portfolio_views enable row level security;

drop policy if exists "Anyone can record portfolio views" on public.portfolio_views;
create policy "Anyone can record portfolio views"
on public.portfolio_views for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_id
      and portfolios.status = 'published'
  )
);

drop policy if exists "Owners can view portfolio analytics" on public.portfolio_views;
create policy "Owners can view portfolio analytics"
on public.portfolio_views for select to authenticated
using (
  exists (
    select 1
    from public.portfolios
    where portfolios.id = portfolio_views.portfolio_id
      and portfolios.user_id = auth.uid()
  )
);

create index if not exists portfolio_views_portfolio_date_idx
on public.portfolio_views (portfolio_id, viewed_at desc);
