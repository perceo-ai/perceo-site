import { NextRequest, NextResponse } from "next/server";
import { decodeState, ensureProjectApiKey, getInstallationAccount, setRepoSecret, upsertGitHubInstallation } from "@/lib/github-setup";

const LOG = (msg: string, ...args: unknown[]) => console.log("[setup-callback]", msg, ...args);
const LOG_ERR = (msg: string, ...args: unknown[]) => console.error("[setup-callback]", msg, ...args);

const SETUP_COOKIE_NAME = "perceo_setup_from_callback";
const SETUP_COOKIE_MAX_AGE = 120; // 2 minutes

function redirectTo(baseUrl: URL, path: string, params?: Record<string, string>): NextResponse {
	const url = new URL(path, baseUrl.origin);
	if (params) {
		for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	}
	const res = NextResponse.redirect(url);
	res.cookies.set(SETUP_COOKIE_NAME, "1", {
		path: "/setup",
		maxAge: SETUP_COOKIE_MAX_AGE,
		httpOnly: true,
		sameSite: "lax",
	});
	return res;
}

export async function GET(request: NextRequest) {
	const baseUrl = new URL(request.url);
	const { searchParams } = baseUrl;
	const installationId = searchParams.get("installation_id");
	const state = searchParams.get("state");

	LOG("GET: callback hit", {
		hasInstallationId: !!installationId,
		hasState: !!state,
		stateLength: state?.length ?? 0,
	});

	const decoded = decodeState(state);
	if (!decoded || !installationId) {
		LOG_ERR("GET: invalid_callback", {
			decoded: !!decoded,
			installationId: !!installationId,
		});
		return redirectTo(baseUrl, "/setup", { error: "invalid_callback" });
	}

	// Persist organization-level installation so we can add more repos without re-authorizing
	const account = await getInstallationAccount(installationId);
	if (account) {
		const ok = await upsertGitHubInstallation(installationId, account.login, account.type);
		if (ok) LOG("GET: persisted installation for account", account.login);
		else LOG_ERR("GET: failed to persist installation for", account.login);
	} else {
		LOG_ERR("GET: could not fetch installation account from GitHub");
	}

	const apiKey = await ensureProjectApiKey(decoded.projectId);
	if (!apiKey) {
		LOG_ERR("GET: no_key for project", decoded.projectId);
		return redirectTo(baseUrl, "/setup", { error: "no_key" });
	}

	try {
		await setRepoSecret(installationId, decoded.owner, decoded.repo, apiKey);
	} catch (err) {
		LOG_ERR("GET: github_error", err instanceof Error ? err.message : err, err);
		return redirectTo(baseUrl, "/setup", { error: "github_error" });
	}

	LOG("GET: success, redirecting to complete");
	return redirectTo(baseUrl, "/setup/complete", {
		repo: `${decoded.owner}/${decoded.repo}`,
	});
}
