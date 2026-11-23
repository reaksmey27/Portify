create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  type text not null check (type in ('portfolio_view', 'portfolio_published', 'profile_updated')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
revoke all on table public.notifications from anon, authenticated;
grant select on table public.notifications to authenticated;
grant insert (user_id, portfolio_id, type, title, message) on table public.notifications to authenticated;
grant update (is_read) on table public.notifications to authenticated;

drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications"
on public.notifications for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can update their notifications" on public.notifications;
create policy "Users can update their notifications"
on public.notifications for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can create their notifications" on public.notifications;
create policy "Users can create their notifications"
on public.notifications for insert to authenticated
with check (auth.uid() = user_id);

create index if not exists notifications_user_created_idx
on public.notifications (user_id, created_at desc);

create or replace function public.notify_portfolio_first_view()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  portfolio_owner uuid;
  portfolio_title text;
begin
  select p.user_id, p.title
    into portfolio_owner, portfolio_title
    from public.portfolios as p
    where p.id = new.portfolio_id
      and p.status = 'published';

  if portfolio_owner is null or auth.uid() = portfolio_owner then
    return new;
  end if;

  if not exists (
    select 1
      from public.portfolio_views as v
      where v.portfolio_id = new.portfolio_id
        and v.visitor_id = new.visitor_id
        and v.id <> new.id
  ) then
    insert into public.notifications (user_id, portfolio_id, type, title, message)
    values (
      portfolio_owner,
      new.portfolio_id,
      'portfolio_view',
      'New portfolio visitor',
      'Someone viewed your portfolio "' || portfolio_title || '".'
    );
  end if;

  return new;
end;
$$;

revoke all on function public.notify_portfolio_first_view() from public, anon, authenticated;

drop trigger if exists on_portfolio_first_view on public.portfolio_views;
create trigger on_portfolio_first_view
after insert on public.portfolio_views
for each row execute function public.notify_portfolio_first_view();
