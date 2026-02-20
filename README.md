# PeakReady

Athletes log daily recovery metrics and get a 0–100 readiness score to guide training and recovery.

---

## Screenshots

<!-- Add app screenshots here (e.g. Dashboard, Log Today, Timeline) -->

---

## Features

- **Daily check-in** — Log sleep (0–24h), workout intensity (1–10), and muscle soreness (1–10) with validation and quick-select chips.
- **Readiness score** — Pure, deterministic calculation (0–100) with color zones (green / yellow / red) and short insight copy.
- **Dashboard** — Circular readiness ring, zone pill, and primary actions (Log Today, View Timeline, Sign Out).
- **Timeline** — List of past logs by date with score pills and per-entry delete.
- **Auth** — Sign in / sign up with Supabase Auth; session persisted via AsyncStorage; unauthenticated users redirected to sign-in.
- **Backend** — Supabase Postgres for daily logs; Row Level Security (RLS) so users only see and modify their own rows.

---

## Tech stack

| Layer        | Technology |
|-------------|------------|
| Runtime     | React Native (Expo SDK 54) |
| Routing     | Expo Router (file-based) |
| Language    | TypeScript |
| Styling     | NativeWind (Tailwind) + React Native `StyleSheet` |
| Backend     | Supabase (Auth + Postgres) |
| Client      | `@supabase/supabase-js` |
| Testing     | Jest + ts-jest |

---

## Architecture

- **UI** — Screens in `app/` (dashboard, log form, history, auth). Reusable components in `components/` (e.g. `GlassCard`, `ReadinessRing`, `MetricChip`). No business or persistence logic in UI.
- **Business logic** — Readiness calculation lives in `utils/readiness.ts`: pure function `calculateReadiness(metrics)`, no I/O. Used by dashboard and history; covered by Jest.
- **Data layer** — `data/logs.ts` exposes `fetchLogs`, `upsertDailyLog`, `deleteLogByDate`, `todayId`. All Supabase access for logs goes through this module; screens never touch the Supabase client for log CRUD.
- **Auth / client** — `lib/supabase.ts` creates the Supabase client with env URL/anon key and AsyncStorage for session persistence. Auth state in root layout drives redirects (signed-out → sign-in; signed-in on auth routes → dashboard).

Separation of concerns: UI renders state; readiness is a pure util; persistence and auth are behind `data/logs` and `lib/supabase`.

---

## Backend (Supabase + RLS)

- **Auth** — Supabase Auth (email/password). Session is persisted in AsyncStorage and used for all API calls.
- **Postgres** — One table used by the app: `daily_logs` (see Database setup below).
- **RLS** — Policies ensure each user can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows where `user_id = auth.uid()`. The app never sends user id in request body for logs; it is set server-side or via RLS.

---

## Environment setup

Create a `.env` in the project root (see `.env.example`). Required variables:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://<ref>.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |

Do not commit `.env`. The app reads these at build/runtime for the Supabase client.

---

## Local development

1. **Clone and install**

   ```bash
   cd peakready
   npm install
   ```

2. **Configure env**

   ```bash
   cp .env.example .env
   # Edit .env with your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Start dev server**

   ```bash
   npx expo start
   ```

   Then open iOS simulator (`i`), Android emulator (`a`), or scan with Expo Go.

4. **Run from project root**

   All commands (install, start, test) must be run from the `peakready` directory (where `package.json` and `app/` live).

---

## Database setup

Create the table and enable RLS in the Supabase SQL editor.

**Table**

```sql
create table public.daily_logs (
  user_id  uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  sleep    numeric not null,
  intensity numeric not null,
  soreness numeric not null,
  primary key (user_id, log_date)
);

-- Optional: index for listing by user and date
create index idx_daily_logs_user_date on public.daily_logs (user_id, log_date desc);
```

**RLS**

- Enable RLS on `public.daily_logs`.
- Policy: allow `SELECT`, `INSERT`, `UPDATE`, `DELETE` where `auth.uid() = user_id`.

Example (adjust to your policy names):

```sql
alter table public.daily_logs enable row level security;

create policy "Users can manage own logs"
  on public.daily_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## Testing

- **Run tests**

  ```bash
  npm test
  ```

- **Scope** — Jest is used for business logic only. The readiness module (`utils/readiness.ts`) is tested in `__tests__/readiness.test.ts` (strong recovery, overtraining, and bounds: score never &lt; 0 or &gt; 100). No UI or Supabase in tests.

---

## Future improvements

- Multiple entries per day (timestamped logs).
- Readiness trend charts and historical insights.
- Optional push notifications or reminders.
- Export or share readiness summary.
- Offline support with sync when back online.

---

## License

Proprietary. All rights reserved.
