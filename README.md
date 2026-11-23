# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Paddle sandbox setup

1. Create the Portify Pro monthly ($8) and yearly ($80) prices in Paddle Sandbox.
2. Put the sandbox client token and both price IDs in `.env` using the `VITE_PADDLE_*` names from `.env.example`, then restart Vite.
3. Apply the latest SQL migration in `supabase/migrations`.
4. Set Edge Function secrets in Supabase: `PADDLE_API_KEY`, `PADDLE_MONTHLY_PRICE_ID`, `PADDLE_YEARLY_PRICE_ID`, and `PADDLE_WEBHOOK_SECRET`. Keep private API and webhook secrets out of `.env` and browser code.
5. Deploy `create-paddle-checkout` with JWT verification enabled. Deploy `paddle-webhook` with JWT verification disabled; signature verification is performed inside the function.
6. In Paddle Sandbox, create a notification destination pointing to `https://<project-ref>.supabase.co/functions/v1/paddle-webhook`. Subscribe to `subscription.created`, `subscription.updated`, `subscription.activated`, `subscription.trialing`, `subscription.past_due`, and `subscription.canceled` events. Add the destination's secret as `PADDLE_WEBHOOK_SECRET`.

Checkout runs in sandbox mode. Pro access is updated only by verified Paddle subscription webhooks.
