# GitHub App setup callback – what you need to configure

The route `GET /api/github/setup-callback` handles the GitHub App installation redirect, decodes `state`, loads the project’s `github-actions` API key, and creates the `PERCEO_API_KEY` repository secret. Below is what you need to set up for it to work.

---

## 1. Environment variables

Set these in your Next.js app (e.g. Vercel / `.env.local`):

| Variable                             | Required | Description                                                                                                                  |
| ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PERCEO_GITHUB_APP_ID`               | Yes      | GitHub App’s numeric App ID.                                                                                                 |
| `PERCEO_GITHUB_APP_PRIVATE_KEY`      | Yes\*    | PEM private key for the GitHub App (full content; use `\n` for newlines in env).                                             |
| `PERCEO_GITHUB_APP_PRIVATE_KEY_PATH` | Yes\*    | Alternative: path to a `.pem` file (e.g. in server-only storage). \*One of private key or path must be set.                  |
| `NEXT_PUBLIC_SUPABASE_URL`           | Yes      | Supabase project URL (used by the callback to look up the project API key).                                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Yes      | Supabase anon key (used by the callback to read the project API key; ensure RLS allows reading the relevant `api_keys` row). |

Optional for CLI install link (no impact on callback behavior):

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

## 3. Supabase schema (API keys)

The callback looks up the project’s CI key from Supabase. You need a table the route can query with the service role.

**Table: `api_keys`** (or adjust the code to match your table name)

Suggested columns:

- `project_id` (uuid, references your projects table)
- `name` (text) – the callback looks for `name = 'github-actions'`
- `value` (text) – the secret value stored as `PERCEO_API_KEY` in the repo

Ensure the key created during `perceo init` for GitHub Actions is stored with `name = 'github-actions'` for the correct `project_id`. If you use Row Level Security (RLS), add a policy that allows the callback to read the `api_keys` row for the given `project_id` (e.g. a policy that permits select when a server-only context is used, or a database function that returns the key and is callable with the anon key).

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

- `projectId` – used to load the `github-actions` API key from Supabase.
- `owner` / `repo` – GitHub repo where the callback will create `PERCEO_API_KEY`.

The callback decodes `state`, loads the key for `projectId`, and creates the secret for `owner/repo`.

---

## 5. Flow summary

1. User runs `perceo init`; CLI creates project and `github-actions` key (stored in Supabase).
2. CLI prints install link: `https://github.com/apps/.../installations/new?state=<base64url({ projectId, owner, repo })>`.
3. User installs/updates the app; GitHub redirects to your **Setup URL** with `installation_id`, `setup_action`, and `state`.
4. Callback decodes `state`, fetches the `github-actions` key for `projectId`, then uses the GitHub App to create `PERCEO_API_KEY` for that repo.
5. User is redirected to `/setup/complete?repo=owner/repo` on success, or `/setup?error=...` on failure.

---

## 6. Errors and redirects

- **Invalid or missing `state` / `installation_id`** → redirect to `/setup?error=invalid_callback`
- **No API key for project** → `/setup?error=no_key`
- **GitHub API error** (e.g. token, permissions, create secret) → `/setup?error=github_error` (details only in server logs)

All logic runs in the Next.js API route; no Temporal worker is required for this flow.
