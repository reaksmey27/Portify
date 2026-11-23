# Portify

Portify is a free portfolio builder for creatives. Every account can create unlimited portfolios, use every template, customize their pages, upload images, publish public links, and view analytics. No subscription or payment is required.

## Run locally

1. Copy `.env.example` to `.env` and add your Supabase project URL and publishable key.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

## Build checks

- `npm run lint`
- `npm run build`

## Supabase cleanup

Apply `supabase/migrations/20261123070000_remove_billing.sql` to remove the subscription table, Paddle webhook event table, and signup trigger. This deletes subscription data and keeps users and portfolios. If the Paddle Edge Functions or secrets were previously deployed, remove them from the Supabase Dashboard too; deleting local source files does not remove deployed functions or secrets.
