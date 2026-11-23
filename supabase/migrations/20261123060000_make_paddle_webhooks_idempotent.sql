alter table public.portify_subscriptions
  drop constraint if exists portify_subscriptions_status_check;

alter table public.portify_subscriptions
  add constraint portify_subscriptions_status_check
  check (status in ('active', 'inactive', 'past_due', 'cancelled'));

create table if not exists public.portify_paddle_webhook_events (
  event_id text primary key,
  occurred_at timestamptz not null,
  processed_at timestamptz not null default now()
);

alter table public.portify_paddle_webhook_events enable row level security;
revoke all on table public.portify_paddle_webhook_events from anon, authenticated;
grant all on table public.portify_paddle_webhook_events to service_role;

create or replace function public.apply_portify_paddle_subscription_event(
  p_event_id text,
  p_occurred_at timestamptz,
  p_user_id uuid,
  p_plan text,
  p_status text,
  p_customer_id text,
  p_subscription_id text,
  p_billing_interval text,
  p_current_period_end timestamptz
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_event_at timestamptz;
begin
  if p_event_id is null or p_event_id !~ '^evt_[a-zA-Z0-9]{26}$' then
    raise exception 'Invalid Paddle event ID';
  end if;
  if p_plan not in ('free', 'pro') or p_status not in ('active', 'inactive', 'past_due', 'cancelled') then
    raise exception 'Invalid subscription state';
  end if;
  if p_billing_interval is not null and p_billing_interval not in ('month', 'year') then
    raise exception 'Invalid billing interval';
  end if;

  insert into public.portify_paddle_webhook_events (event_id, occurred_at)
  values (p_event_id, p_occurred_at)
  on conflict (event_id) do nothing;
  if not found then
    return 'duplicate';
  end if;

  select paddle_event_occurred_at
    into previous_event_at
    from public.portify_subscriptions
    where user_id = p_user_id
    for update;

  if previous_event_at is not null and previous_event_at > p_occurred_at then
    return 'stale';
  end if;

  insert into public.portify_subscriptions (
    user_id, plan, status, paddle_customer_id, paddle_subscription_id,
    billing_interval, current_period_end, paddle_event_occurred_at, updated_at
  ) values (
    p_user_id, p_plan, p_status, p_customer_id, p_subscription_id,
    p_billing_interval, p_current_period_end, p_occurred_at, now()
  )
  on conflict (user_id) do update set
    plan = excluded.plan,
    status = excluded.status,
    paddle_customer_id = excluded.paddle_customer_id,
    paddle_subscription_id = excluded.paddle_subscription_id,
    billing_interval = excluded.billing_interval,
    current_period_end = excluded.current_period_end,
    paddle_event_occurred_at = excluded.paddle_event_occurred_at,
    updated_at = now()
  where public.portify_subscriptions.paddle_event_occurred_at is null
     or public.portify_subscriptions.paddle_event_occurred_at <= excluded.paddle_event_occurred_at;

  return 'processed';
end;
$$;

revoke all on function public.apply_portify_paddle_subscription_event(text, timestamptz, uuid, text, text, text, text, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.apply_portify_paddle_subscription_event(text, timestamptz, uuid, text, text, text, text, text, timestamptz)
  to service_role;
