drop policy if exists "Anyone can view published portfolios" on public.portfolios;

create policy "Anyone can view published portfolios"
on public.portfolios
for select
to anon, authenticated
using (status = 'published');
