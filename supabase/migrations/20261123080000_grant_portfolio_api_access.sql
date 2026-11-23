alter table public.portfolios enable row level security;

revoke all on table public.portfolios from anon, authenticated;
grant select on table public.portfolios to anon, authenticated;
grant insert, update, delete on table public.portfolios to authenticated;

drop policy if exists "Users can view their portfolios" on public.portfolios;
create policy "Users can view their portfolios"
on public.portfolios for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Anyone can view published portfolios" on public.portfolios;
create policy "Anyone can view published portfolios"
on public.portfolios for select to anon, authenticated
using (status = 'published');

drop policy if exists "Users can create their portfolios" on public.portfolios;
create policy "Users can create their portfolios"
on public.portfolios for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their portfolios" on public.portfolios;
create policy "Users can update their portfolios"
on public.portfolios for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their portfolios" on public.portfolios;
create policy "Users can delete their portfolios"
on public.portfolios for delete to authenticated
using (auth.uid() = user_id);
