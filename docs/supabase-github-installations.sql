-- Run this in the Supabase SQL editor to create the table used for
-- organization-level GitHub App authorization (one install per org).
-- See docs/GITHUB_APP_SETUP.md.

create table if not exists github_installations (
  installation_id bigint primary key,
  account_login   text not null,
  account_type    text not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_github_installations_account_login
  on github_installations (account_login);
