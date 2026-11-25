# Block City accounts: one-time Supabase setup

Block City can save a player's game to an account so it follows them between phone and laptop.
Players sign in with their email address and a 6-digit code that is emailed to them. There is no password.

The game itself is a static page, so the accounts live in a free [Supabase](https://supabase.com) project that you create.
This page walks through it click by click. It takes about 15 minutes. You do it once.

Until you finish, the game works exactly as before: the Account button says "Accounts are not set up yet" and saves stay on the device.

> Menu names in the Supabase dashboard move around from time to time. If a label below is not exactly where this page says,
> use the search box at the top of the dashboard and type the name of the setting.

## What is private and what is public

- This repository is public. It must never contain a real person's email address, and it never needs one.
  Every example here uses `player@example.com`. When a step says "put your email here", you type it into the Supabase website, not into a file.
- Two values from Supabase go into the game's source: the **Project URL** and the **anon / publishable key**. Both are designed to be public.
  They only let a browser talk to your project; the database rules below decide what each signed-in player may touch.
- The **service_role key** (also called the **secret key**, starts with `sb_secret_` on newer projects) must never be put in the game,
  in this repository, in a chat or in an email. The game does not need it. Nobody should ask you for it.
- Player email addresses are stored by Supabase Auth in a private table (`auth.users`) that the game cannot read.
  The game's own table holds only: the player's id (a random number), their save, the admin flag and a timestamp.

## Step 1: create the project

1. Go to https://supabase.com and sign up (or sign in).
2. Click **New project**.
3. Name: `block-city` (any name works). Database password: click **Generate a password** and save it in your password manager. You will not need it for the game.
4. Region: pick the one closest to you. Plan: **Free**.
5. Click **Create new project** and wait a minute or two until the dashboard opens.

## Step 2: create the table and its safety rules

1. In the left menu click **SQL Editor**.
2. Click **New query**.
3. Copy everything in the grey box below, paste it into the editor, and click **Run**.
4. You should see "Success. No rows returned". It is safe to run it again later; it does not delete any data.

```sql
-- ============================================================
-- Block City accounts: table, row level security, triggers
-- Safe to run more than once.
-- ============================================================

-- 1. One row per player. The email is NOT stored here; it stays in Supabase Auth.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  save       jsonb,
  is_admin   boolean     not null default false,
  updated_at timestamptz not null default now(),
  constraint profiles_save_size check (save is null or octet_length(save::text) < 1500000)
);

-- 2. Row Level Security: a signed-in player can only see and change their own row.
alter table public.profiles enable row level security;

drop policy if exists "profiles: read own row"   on public.profiles;
drop policy if exists "profiles: insert own row" on public.profiles;
drop policy if exists "profiles: update own row" on public.profiles;

create policy "profiles: read own row" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: insert own row" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: update own row" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 3. Column privileges: players may write the "save" column and nothing else.
--    Not signed in (anon) = no access at all. No delete privilege for anyone.
revoke all on public.profiles from anon, authenticated;
grant select (id, save, is_admin, updated_at) on public.profiles to authenticated;
grant insert (id, save)                       on public.profiles to authenticated;
grant update (save)                           on public.profiles to authenticated;

-- 4. Second lock on the admin flag, and a server-side timestamp.
--    Even if step 3 were loosened by mistake later, a player's request can never change is_admin or id.
create or replace function public.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.is_admin := false;
    else
      new.is_admin := old.is_admin;
      new.id       := old.id;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before insert or update on public.profiles
  for each row execute function public.profiles_guard();

-- 5. Create the row automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. "Delete my account data" button: removes the caller's own account (and, by cascade, their row).
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant  execute on function public.delete_my_account() to authenticated;
revoke execute on function public.handle_new_user()   from public, anon, authenticated;
revoke execute on function public.profiles_guard()    from public, anon, authenticated;
```

### Why a player cannot make themselves admin

The admin flag is protected twice, and either lock is enough on its own:

- **Column privileges (step 3).** The `authenticated` role (every signed-in player) has `update` on the `save` column only and
  `insert` on `id` and `save` only. A request such as "set is_admin to true on my row" is rejected by Postgres with
  "permission denied" before any row is touched.
- **Trigger (step 4).** For requests arriving as `anon` or `authenticated`, the trigger puts the old value of `is_admin` back
  (and forces `false` on insert). You, in the SQL editor, run as the database owner, so your change goes through.

Thinking it through as an attacker who has the public anon key and their own valid sign-in:

| They try | What happens |
|---|---|
| Read another player's row or list all rows | RLS: only the row where `id = auth.uid()` is visible. They get nothing. |
| Read anyone's email | Emails are in `auth.users`, which the API does not expose. The game table has no email column. |
| `update profiles set is_admin = true` on their own row | Refused by the column privilege. If that were missing, the trigger would silently keep `false`. |
| Insert a new row with `is_admin = true` | Refused by the column privilege; the trigger would force `false`; the id must equal their own (RLS). |
| Upsert, or change `id` to someone else's | No update privilege on `id`; the RLS check would also fail. |
| Use the anon key without signing in | The `anon` role has no privileges on the table at all. |
| Edit the game in their browser to show unlimited money | Possible, as in any single-player browser game, and it only affects their own game. It does not change the flag in the database or anyone else's data. |
| Delete someone else's account | `delete_my_account()` only ever deletes the caller's own id. |

## Step 3: sign-in settings

1. Left menu: **Authentication**.
2. Open **Sign In / Providers** (on older dashboards: **Providers**). Click **Email**.
   - **Enable Email provider**: on.
   - **Confirm email**: on.
   - **Email OTP Length**: `6`. (The game expects exactly six digits.)
   - **Email OTP Expiration**: `3600` seconds (one hour) is fine.
   - Click **Save**.
3. Still in Authentication, check that **Allow new users to sign up** is on (it is by default).
   Tip: once everyone who should have an account has signed in once, you can switch this off. After that nobody new can create an account.

## Step 4: make the email contain the 6-digit code

By default Supabase emails a link. The game needs the code instead.

1. **Authentication** -> **Emails** (or **Email Templates**).
2. Open the **Magic Link** template. Replace the message body with:

   ```html
   <h2>Your Block City code</h2>
   <p>Enter this code in the game to sign in:</p>
   <p style="font-size:32px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
   <p>The code works for one hour. If you did not ask for it, you can ignore this email.</p>
   ```

   Subject: `Your Block City sign-in code`. Click **Save**.
3. Open the **Confirm signup** template and paste the same body and subject. Click **Save**.
   (The first time an email address is used Supabase sends this template; afterwards it sends Magic Link. Both must show `{{ .Token }}`.)

Do not include `{{ .ConfirmationURL }}`: the game is used inside an app, where a link would open in the wrong place.

## Step 5: site address

1. **Authentication** -> **URL Configuration**.
2. **Site URL**: `https://jacobjburrell.github.io/block-city/`
3. **Redirect URLs**: click **Add URL**, enter `https://jacobjburrell.github.io/block-city/`, and save.

(The game signs in with a code and never follows a redirect, but setting these keeps any link Supabase ever sends pointing at the real game and nowhere else.)

## Step 6: about the emails (important)

Supabase's built-in email sender is only meant for trying things out:

- It sends **only a few emails per hour** for the whole project (the limit has been as low as 2 per hour; the current number is shown under **Authentication** -> **Rate Limits**).
- It may deliver **only to email addresses that are members of your Supabase organisation**. Your own address works; a friend's may not.

That is enough for you to test. If codes stop arriving, you have most likely hit the hourly limit: wait an hour.

To let other people sign in, or to remove the limit, add your own email sender later:

1. Create an account with an email service that offers SMTP (for example Resend, Brevo, Postmark or Amazon SES; several have a free tier).
   Follow their steps to verify the address or domain you will send from.
2. In Supabase: **Authentication** -> **Emails** -> **SMTP Settings** -> turn on **Enable Custom SMTP**.
3. Fill in the sender email, sender name (`Block City`), host, port, username and password that the email service gave you. Save.
4. Under **Authentication** -> **Rate Limits** you can now raise "emails per hour".

The SMTP password is typed into the Supabase dashboard only. It never goes in the game or the repository.

## Step 7: find the two values for the game

1. Click **Project Settings** (gear icon) -> **API** (on newer dashboards: **Data API** for the URL and **API Keys** for the key; the **Connect** button at the top also shows both).
2. Copy the **Project URL**. It looks like `https://abcdefghijklmnop.supabase.co`.
3. Copy the key labelled **anon** / **public** (a long text starting with `eyJ`), or on newer projects the **Publishable key** (starts with `sb_publishable_`). Either works.
4. Send those two values to whoever maintains the game. They go at the top of `src/mods/account/mod.js`:

   ```js
   const acCfg={url:'https://abcdefghijklmnop.supabase.co',anon:'the-anon-or-publishable-key'};
   ```

   Then rebuild (`python src/build.py`), test and publish as usual.

Do **not** copy the key labelled **service_role** or **secret**.

## Step 8: make your own account the admin (unlimited money)

1. Open the published game, tap **Account**, enter your email, enter the code. This creates your account.
2. In Supabase open **SQL Editor** -> **New query**, paste this line, **replace `player@example.com` with your own email address** and click **Run**:

   ```sql
   update public.profiles set is_admin = true where id = (select id from auth.users where email = 'player@example.com');
   ```

   It should say "Success" and 1 row affected. If it says 0 rows, the email does not match an account yet: sign in to the game once first.
3. Restart the game. The cash display shows **$∞** and the Account card shows an ADMIN badge.

Your email is typed into the Supabase website only. Never save that edited line in this repository.

To remove admin again, run the same line with `false` instead of `true`.

How the perk behaves: while the flag is on, everything is free. Your real cash total is kept separately and is what gets saved,
so turning the flag off (or signing out) puts you back to your real cash.

## How it behaves for players

- **Sign in:** Account -> email -> **Send code** -> type the six digits. On iPhone the code is offered above the keyboard.
- **Saving:** the game saves to the account whenever it saves locally, at most about once every 15 seconds, and when the page is closed or hidden.
  The local save on the device is always kept as well.
- **Offline:** play continues; the save is sent when the connection is back.
- **Two devices:** if the account has a newer save and this device has nothing new, the newer one loads by itself on the title screen.
  If both have changed, the game asks which to keep and shows cash and time for each. The one not chosen on this device is kept as a backup in the browser.
- **Screen and layout settings** (graphics quality, screen rotation, left-handed layout, FPS counter) stay per device.
- **Inside the Sekai app:** some in-app browsers do not let an embedded page remember things. If the sign-in is not remembered, the game says so and asks for a code again next time. Nothing is lost; the account has the save.
- **Sign out** keeps the save on the device. **Delete my account data** removes the account and its save from Supabase (the device keeps its own local save).

## Looking after it

- See accounts: **Authentication** -> **Users**. See saves: **Table Editor** -> `profiles`.
- Remove a player: delete them under **Authentication** -> **Users**; their row is removed automatically.
- Free projects are paused after about a week without any use. If sign-in stops working after a long break, open the Supabase dashboard and click **Restore project**.
- If the anon key is ever rotated in Supabase, the new one must be put in `acCfg` and the game republished.
