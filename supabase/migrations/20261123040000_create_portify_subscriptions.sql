create table if not exists public.portify_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'inactive', 'past_due', 'cancelled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portify_subscriptions enable row level security;

drop policy if exists "Users can view their own subscription" on public.portify_subscriptions;
create policy "Users can view their own subscription"
on public.portify_subscriptions for select to authenticated
using (auth.uid() = user_id);

revoke all on table public.portify_subscriptions from anon, authenticated;
grant select on table public.portify_subscriptions to authenticated;

create or replace function public.create_portify_subscription()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.portify_subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.create_portify_subscription() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_portify on auth.users;
create trigger on_auth_user_created_portify
after insert on auth.users
for each row
execute function public.create_portify_subscription();
