# GitHub App setup callback – what you need to configure

The route `GET /api/github/setup-callback` handles the GitHub App installation redirect, decodes `state`, gets or creates the project’s `github-actions` API key, and creates the `PERCEO_API_KEY` repository secret in GitHub. You do not need to run `perceo init` first—the callback creates the key if it’s missing. Below is what you need to set up for it to work.

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

## 3. Supabase schema (API keys)

The callback reads from and, when missing, writes to the project’s API key row.

**Table: `projects_api_keys`**

Suggested columns:

- `project_id` (uuid, references your projects table)
- `name` (text) – the callback uses `name = 'github-actions'`
- `value` (text) – the secret stored as `PERCEO_API_KEY` in the repo

If no row exists for `project_id` + `name = 'github-actions'`, the callback creates one with a new random key. For that insert to succeed with RLS enabled, either set `SUPABASE_SERVICE_ROLE_KEY` (recommended) or add an RLS policy that allows the anon key to insert this row.

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

1. User has a project (e.g. created in your app or via CLI). The project has a `project_id` (uuid).
2. User is sent to the GitHub App install link: `https://github.com/apps/.../installations/new?state=<base64url({ projectId, owner, repo })>`.
3. User installs/updates the app; GitHub redirects to your **Setup URL** with `installation_id`, `setup_action`, and `state`.
4. Callback decodes `state`, gets the existing `github-actions` key for `projectId` or creates one if missing, then uses the GitHub App to create `PERCEO_API_KEY` in the repo.
5. User is redirected to `/setup/complete?repo=owner/repo` on success, or `/setup?error=...` on failure.

---

## 6. Errors and redirects

- **Invalid or missing `state` / `installation_id`** → redirect to `/setup?error=invalid_callback`
- **Could not get or create API key** (e.g. project missing, Supabase not configured, or insert blocked by RLS without service role) → `/setup?error=no_key`
- **GitHub API error** (e.g. token, permissions, create secret) → `/setup?error=github_error` (details only in server logs)

All logic runs in the Next.js API route; no Temporal worker is required for this flow.
