alter table public.portify_subscriptions
  add column if not exists paddle_customer_id text,
  add column if not exists paddle_subscription_id text,
  add column if not exists paddle_event_occurred_at timestamptz,
  add column if not exists billing_interval text
    check (billing_interval in ('month', 'year'));

create unique index if not exists portify_paddle_subscription_unique
  on public.portify_subscriptions (paddle_subscription_id)
  where paddle_subscription_id is not null;
