drop function if exists public.apply_portify_paddle_subscription_event(
  text, timestamptz, uuid, text, text, text, text, text, timestamptz
);

drop table if exists public.portify_paddle_webhook_events;

drop trigger if exists on_auth_user_created_portify on auth.users;
drop function if exists public.create_portify_subscription();
drop table if exists public.portify_subscriptions;
