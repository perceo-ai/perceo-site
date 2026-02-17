import { NextRequest, NextResponse } from "next/server";
import { createSign, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import sodium from "libsodium-wrappers";
import { createClient } from "@supabase/supabase-js";

const GITHUB_API = "https://api.github.com";
const SECRET_NAME = "PERCEO_API_KEY";

type DecodedState = { projectId: string; owner: string; repo: string };

const LOG = (msg: string, ...args: unknown[]) => console.log("[setup-callback]", msg, ...args);
const LOG_ERR = (msg: string, ...args: unknown[]) => console.error("[setup-callback]", msg, ...args);

function decodeState(state: string | null): DecodedState | null {
	if (!state) {
		LOG("decodeState: no state in query");
		return null;
	}
	try {
		const raw = Buffer.from(state, "base64url").toString("utf8");
		LOG("decodeState: raw state length", raw.length);
		const parsed = JSON.parse(raw) as unknown;
		if (
			parsed &&
			typeof parsed === "object" &&
			"projectId" in parsed &&
			"owner" in parsed &&
			"repo" in parsed &&
			typeof (parsed as DecodedState).projectId === "string" &&
			typeof (parsed as DecodedState).owner === "string" &&
			typeof (parsed as DecodedState).repo === "string"
		) {
			const d = parsed as DecodedState;
			LOG("decodeState: ok", { projectId: d.projectId, owner: d.owner, repo: d.repo });
			return d;
		}
		LOG("decodeState: parsed object missing or invalid fields", parsed);
	} catch (e) {
		LOG_ERR("decodeState: parse failed", e instanceof Error ? e.message : e);
	}
	return null;
}

function getPrivateKey(): string {
	const path = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY_PATH;
	if (path) {
		LOG("getPrivateKey: using path", path);
		return readFileSync(path, "utf8");
	}
	const raw = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY ?? "";
	LOG("getPrivateKey: using env, length", raw.length);
	return raw.replace(/\\n/g, "\n");
}

function createAppJwt(): string {
	LOG("createAppJwt: building JWT");
	const appId = process.env.PERCEO_GITHUB_APP_ID;
	if (!appId) {
		LOG_ERR("createAppJwt: PERCEO_GITHUB_APP_ID is not set");
		throw new Error("PERCEO_GITHUB_APP_ID is not set");
	}
	const privateKey = getPrivateKey();
	if (!privateKey) {
		LOG_ERR("createAppJwt: no private key (PERCEO_GITHUB_APP_PRIVATE_KEY or PATH not set)");
		throw new Error("PERCEO_GITHUB_APP_PRIVATE_KEY or PERCEO_GITHUB_APP_PRIVATE_KEY_PATH is not set");
	}
	const now = Math.floor(Date.now() / 1000);
	const payload = { iat: now, exp: now + 60, iss: appId };
	const header = { alg: "RS256", typ: "JWT" };
	const base64url = (b: Buffer) => b.toString("base64url");
	const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
	const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
	const sign = createSign("RSA-SHA256");
	sign.update(`${headerB64}.${payloadB64}`);
	const sig = sign.sign(privateKey, "base64url");
	LOG("createAppJwt: ok");
	return `${headerB64}.${payloadB64}.${sig}`;
}

function getSupabaseClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return null;
	return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Uses service role if set, so the callback can create keys even when RLS restricts anon. */
function getSupabaseServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !serviceKey) return null;
	return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function getProjectApiKey(projectId: string): Promise<string | null> {
	LOG("getProjectApiKey: projectId", projectId);
	const supabase = getSupabaseClient();
	if (!supabase) {
		LOG_ERR("getProjectApiKey: Supabase not configured (missing URL or anon key)");
		return null;
	}
	const { data, error } = await supabase.from("projects_api_keys").select("value").eq("project_id", projectId).eq("name", "github-actions").maybeSingle();
	if (error) {
		LOG_ERR("getProjectApiKey: Supabase lookup failed", error.message, error);
		return null;
	}
	const hasKey = !!data?.value;
	LOG("getProjectApiKey:", hasKey ? "found key" : "no key for project");
	return data?.value ?? null;
}

/** Create a github-actions API key for the project. Uses service role client if available so RLS does not block insert. */
async function createProjectApiKey(projectId: string): Promise<string | null> {
	LOG("createProjectApiKey: creating key for projectId", projectId);
	const client = getSupabaseServiceClient() ?? getSupabaseClient();
	if (!client) {
		LOG_ERR("createProjectApiKey: Supabase not configured");
		return null;
	}
	const value = randomBytes(32).toString("base64url");
	const { data, error } = await client.from("projects_api_keys").insert({ project_id: projectId, name: "github-actions", value }).select("value").single();
	if (error) {
		LOG_ERR("createProjectApiKey: insert failed", error.message, error);
		return null;
	}
	LOG("createProjectApiKey: created");
	return data?.value ?? value;
}

async function encryptSecretForGitHub(publicKeyBase64: string, secretValue: string): Promise<string> {
	await sodium.ready;
	const binkey = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
	const binsec = sodium.from_string(secretValue);
	const encBytes = sodium.crypto_box_seal(binsec, binkey);
	return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}

async function setRepoSecret(installationId: string, owner: string, repo: string, apiKeyValue: string): Promise<void> {
	LOG("setRepoSecret: start", { installationId, owner, repo });
	const jwt = createAppJwt();
	LOG("setRepoSecret: requesting installation access token");
	const tokenRes = await fetch(`${GITHUB_API}/app/installations/${installationId}/access_tokens`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${jwt}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
	if (!tokenRes.ok) {
		const text = await tokenRes.text();
		LOG_ERR("setRepoSecret: token request failed", tokenRes.status, text);
		throw new Error(`GitHub token: ${tokenRes.status} ${text}`);
	}
	const tokenData = (await tokenRes.json()) as { token?: string };
	const { token } = tokenData;
	if (!token) {
		LOG_ERR("setRepoSecret: token response missing token field", tokenData);
		throw new Error("GitHub token response missing token");
	}
	LOG("setRepoSecret: token ok, fetching repo public key");

	const keyRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/public-key`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
	if (!keyRes.ok) {
		const text = await keyRes.text();
		LOG_ERR("setRepoSecret: public key request failed", keyRes.status, text);
		throw new Error(`GitHub public key: ${keyRes.status} ${text}`);
	}
	const keyData = (await keyRes.json()) as { key?: string; key_id?: string };
	const { key: publicKey, key_id: keyId } = keyData;
	if (!publicKey || !keyId) {
		LOG_ERR("setRepoSecret: public key response missing key or key_id", keyData);
		throw new Error("GitHub public key response missing key or key_id");
	}
	LOG("setRepoSecret: public key ok, encrypting and creating secret");

	const encryptedValue = await encryptSecretForGitHub(publicKey, apiKeyValue);

	const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/${SECRET_NAME}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ encrypted_value: encryptedValue, key_id: keyId }),
	});
	if (!putRes.ok) {
		const text = await putRes.text();
		LOG_ERR("setRepoSecret: create secret failed", putRes.status, text);
		throw new Error(`GitHub create secret: ${putRes.status} ${text}`);
	}
	LOG("setRepoSecret: done");
}

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

	LOG("GET: callback hit", { hasInstallationId: !!installationId, hasState: !!state, stateLength: state?.length ?? 0 });

	const decoded = decodeState(state);
	if (!decoded || !installationId) {
		LOG_ERR("GET: invalid_callback", { decoded: !!decoded, installationId: !!installationId });
		return redirectTo(baseUrl, "/setup", { error: "invalid_callback" });
	}

	let apiKey = await getProjectApiKey(decoded.projectId);
	if (!apiKey) {
		apiKey = await createProjectApiKey(decoded.projectId);
	}
	if (!apiKey) {
		LOG_ERR("GET: no_key for project (create failed or not allowed)", decoded.projectId);
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
