# Huff

Huff logs cigarettes against a daily running budget. A morning run sets how many cigarettes the day allows, and Strava is what proves the run happened. Going over budget creates running debt. Staying under it is the daily win.

This repo is the skeleton: an Expo app, a Fastify API, shared rules, and a Supabase migration. Strava login, budget math, and push notifications are not built yet.

## Layout

```
apps/mobile            Expo app
apps/api               Fastify API
packages/shared        Domain types and budget constants
supabase/migrations    Postgres schema
```

## Setup

Node.js with Corepack. pnpm is pinned in `package.json` and is invoked through Corepack, so it does not need to be installed globally.

```bash
corepack pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

`.env` files stay untracked. The examples use local placeholders so both apps can start before a Supabase project exists. Replace them with the project URL and keys when you have a project.

`apps/api/.env` holds the service role key, the cron secret, and the Strava client secret. `apps/mobile/.env` holds only the public Supabase URL, the anon key, and the API URL. The example API listens on port 8080, and `EXPO_PUBLIC_API_URL` points at that same port. Keep those two in sync if you change the port.

Leave `SUPABASE_JWT_SECRET` empty to verify access tokens with the project's JWKS instead of the legacy shared secret.

## Run

```bash
corepack pnpm dev:api
corepack pnpm dev:mobile
```

`GET http://127.0.0.1:8080/health` returns `{ "ok": true }` with the example port. The Expo dev server can open the app on a simulator, a device, or the web.

`corepack pnpm typecheck` checks the shared package, the API, and the app.

## Database

Apply [supabase/migrations/20261016065100_init.sql](supabase/migrations/20261016065100_init.sql) in the Supabase SQL editor, or with the Supabase CLI after the project is linked. The API does not run this file.

The tables are profiles, Strava tokens, runs, cigarette logs, daily budgets, debts, streaks, and the notification log. Row level security is on and the anon key cannot read or write them. The API is expected to use the service role.

## Strava

Create the API application at [strava.com/settings/api](https://www.strava.com/settings/api) before building OAuth. A Strava subscription is required to create an app.

A new app starts in single-player mode: only your own athlete account can connect. From the API settings page you can raise that to 10 athletes without a review. Anything past 10 has to be submitted to Strava, and a higher limit is not guaranteed. Do that before the OAuth work, and re-check [the getting started guide](https://developers.strava.com/docs/getting-started/) because the cap changes.

Strava's API agreement was updated on June 1, 2026. Read it before displaying activity data. Default rate limits are modest, so new runs should arrive through webhooks rather than polling. When you have credentials, put the client id, client secret, and webhook verify token in `apps/api/.env`. Those routes only acknowledge requests today.
