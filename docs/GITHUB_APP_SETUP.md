# GitHub App setup – organization-level authorization

GitHub authorizes the app **per organization** (or per user account). This project reflects that: users authorize **once per organization**. After that, additional repos in the same org can be configured without going through the install flow again.

The route `GET /api/github/setup-callback` handles the GitHub App installation redirect: it decodes `state`, persists the installation at the org level, gets or creates the project’s `github-actions` API key, and creates the `PERCEO_API_KEY` repository secret in GitHub. The route `POST /api/github/configure-repo` lets you configure an additional repo for an already-authorized org without redirecting the user to GitHub again.

---

## 1. Environment variables

Set these in your Next.js app (e.g. Vercel / `.env.local`):

| Variable                             | Required | Description                                                                                                              |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PERCEO_GITHUB_APP_ID`               | Yes      | GitHub App’s numeric App ID.                                                                                             |
| `PERCEO_GITHUB_APP_PRIVATE_KEY`      | Yes\*    | PEM private key for the GitHub App (full content; use `\n` for newlines in env).                                         |
| `PERCEO_GITHUB_APP_PRIVATE_KEY_PATH` | Yes\*    | Alternative: path to a `.pem` file (e.g. in server-only storage). \*One of private key or path must be set.              |
| `NEXT_PUBLIC_SUPABASE_URL`           | Yes      | Supabase project URL (used by the callback to look up the project API key).                                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Yes      | Supabase anon key (used by the callback to read and, if allowed, create the project API key).                            |
| `SUPABASE_SERVICE_ROLE_KEY`          | No       | If set, the callback uses it to create a `github-actions` key when none exists (recommended if RLS blocks anon inserts). |

Optional:

- `PERCEO_GITHUB_APP_INSTALL_URL` – e.g. `https://github.com/apps/your-app-slug` so the CLI can build the install link with `?state=...`.

---

## 2. GitHub App settings

In your [GitHub App](https://github.com/settings/apps) configuration:

1. **Setup URL**  
   Set to your callback URL, e.g.:  
   `https://your-app-domain.com/api/github/setup-callback`

2. **Repository permissions**  
   Under **Permissions → Repository permissions**, set:
    - **Actions: Secrets** → **Read and write**  
      So the app can create `PERCEO_API_KEY` in the repo.

3. **Where the app can be installed**  
   Choose “Only on this account” or “Any account” as needed.

---

## 3. Supabase schema

### 3.1 Table: `github_installations` (organization-level authorization)

The callback and configure-repo flow use this table so we only require one authorization per organization.

| Column            | Type      | Description                                        |
| ----------------- | --------- | -------------------------------------------------- |
| `installation_id` | bigint PK | GitHub App installation ID (from callback query). |
| `account_login`   | text      | Org or user login (lowercase).                     |
| `account_type`    | text      | `'Organization'` or `'User'`.                     |
| `created_at`      | timestamptz | Set on first insert (default now).              |
| `updated_at`      | timestamptz | Updated on upsert.                              |

Create the table (e.g. in Supabase SQL editor):

```sql
create table if not exists github_installations (
  installation_id bigint primary key,
  account_login   text not null,
  account_type    text not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- For lookups by org when configuring additional repos
create index if not exists idx_github_installations_account_login
  on github_installations (account_login);
```

The callback upserts a row after each successful install so that `POST /api/github/configure-repo` can find the installation by `account_login` when adding another repo from the same org.

### 3.2 Table: `project_api_keys`

The callback (and configure-repo) write to `project_api_keys`: they revoke any existing active `github-actions` key for the project, then insert a new row with a generated key (stored as `key_hash` and `key_prefix`; the plain key is only used once to set `PERCEO_API_KEY` in GitHub).

Required columns:

- `project_id` (uuid, references `projects.id`)
- `name` (text) – the callback uses `name = 'github-actions'`
- `key_hash` (text) – bcrypt hash of the secret (callback generates `prc_` + base64url and hashes it)
- `key_prefix` (text) – first 12 characters of the key for display
- `scopes` (text[]) – callback uses `ci:analyze`, `ci:test`, `flows:read`, `insights:read`, `events:publish`
- Optional: `revoked_at`, `revocation_reason` (callback revokes existing key before creating a new one)

For the insert to succeed with RLS enabled, set `SUPABASE_SERVICE_ROLE_KEY` (recommended) or add an RLS policy that allows the anon key to insert/update this table. The same applies to `github_installations` if RLS is on.

---

## 4. CLI install link and `state`

The CLI (or your install flow) should direct users to:

```text
https://github.com/apps/YOUR_APP_SLUG/installations/new?state=STATE
```

`STATE` must be **base64url-encoded JSON**:

```json
{ "projectId": "uuid", "owner": "org-or-user", "repo": "repo-name" }
```

- `projectId` – used to get or create the `github-actions` API key in Supabase, then store it as `PERCEO_API_KEY` in the repo.
- `owner` / `repo` – GitHub repo where the callback will create the secret.

The callback decodes `state`, gets or creates the key for `projectId`, then creates `PERCEO_API_KEY` for `owner/repo`.

---

## 5. Flow summary

**First repo in an organization (or first time adding Perceo to that org):**

1. User has a project (e.g. created in your app or via CLI). The project has a `project_id` (uuid).
2. User is sent to the GitHub App install link: `https://github.com/apps/.../installations/new?state=<base64url({ projectId, owner, repo })>`.
3. User installs the app for that organization (one-time per org). GitHub redirects to your **Setup URL** with `installation_id`, `setup_action`, and `state`.
4. Callback decodes `state`, **persists the installation for that org** in `github_installations`, gets or creates the `github-actions` key for `projectId`, then creates `PERCEO_API_KEY` in the repo.
5. User is redirected to `/setup/complete?repo=owner/repo` on success, or `/setup?error=...` on failure.

**Additional repos in the same organization:**

1. Call `POST /api/github/configure-repo` with body `{ projectId, owner, repo }`.
2. If the org is already authorized (row in `github_installations`), the API creates/gets the project API key and sets the repo secret using the stored `installation_id`. No redirect to GitHub.
3. If the org is not authorized, the API returns `404` with `needInstall: true` and `installUrl` (and optionally `state`). The client can then send the user to that install URL so they authorize once for that org.

---

## 6. Errors and redirects (setup callback)

- **Invalid or missing `state` / `installation_id`** → redirect to `/setup?error=invalid_callback`
- **Could not get or create API key** (e.g. project missing, Supabase not configured, or insert blocked by RLS without service role) → `/setup?error=no_key`
- **GitHub API error** (e.g. token, permissions, create secret) → `/setup?error=github_error` (details only in server logs)

## 7. Configure-repo API (`POST /api/github/configure-repo`)

- **Body:** `{ "projectId": "uuid", "owner": "org-or-user", "repo": "repo-name" }`
- **200** – Repo configured; `PERCEO_API_KEY` set in GitHub.
- **400** – Invalid or missing body.
- **404** – Organization not yet authorized. Response includes `needInstall: true` and `installUrl` (full URL with state). Client should redirect the user to install the app for that org once, then call this API again or use the setup callback.
- **500** – Could not create/find project API key.
- **502** – GitHub API error while setting the secret.

All logic runs in the Next.js API routes; no Temporal worker is required.
