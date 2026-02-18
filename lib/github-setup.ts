import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import sodium from "libsodium-wrappers";
import { createClient } from "@supabase/supabase-js";

export const GITHUB_API = "https://api.github.com";
export const SECRET_NAME = "PERCEO_API_KEY";
export const KEY_PREFIX_LENGTH = 12;

/** Scopes for the github-actions API key (matches CLI). */
export const GITHUB_ACTIONS_SCOPES = ["ci:analyze", "ci:test", "flows:read", "insights:read", "events:publish"] as const;

export type DecodedState = { projectId: string; owner: string; repo: string };

export function decodeState(state: string | null): DecodedState | null {
	if (!state) return null;
	try {
		const raw = Buffer.from(state, "base64url").toString("utf8");
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
			return parsed as DecodedState;
		}
	} catch {
		// ignore
	}
	return null;
}

export function encodeState(d: DecodedState): string {
	return Buffer.from(JSON.stringify(d), "utf8").toString("base64url");
}

function getPrivateKey(): string {
	const path = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY_PATH;
	if (path) return readFileSync(path, "utf8");
	const raw = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY ?? "";
	return raw.replace(/\\n/g, "\n");
}

export function createAppJwt(): string {
	const appId = process.env.PERCEO_GITHUB_APP_ID;
	if (!appId) throw new Error("PERCEO_GITHUB_APP_ID is not set");
	const privateKey = getPrivateKey();
	if (!privateKey) throw new Error("PERCEO_GITHUB_APP_PRIVATE_KEY or PERCEO_GITHUB_APP_PRIVATE_KEY_PATH is not set");
	const now = Math.floor(Date.now() / 1000);
	const payload = { iat: now, exp: now + 60, iss: appId };
	const header = { alg: "RS256", typ: "JWT" };
	const base64url = (b: Buffer) => b.toString("base64url");
	const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
	const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
	const sign = createSign("RSA-SHA256");
	sign.update(`${headerB64}.${payloadB64}`);
	const sig = sign.sign(privateKey, "base64url");
	return `${headerB64}.${payloadB64}.${sig}`;
}

export function getSupabaseServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !serviceKey) return null;
	return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function getSupabaseClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return null;
	return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Fetches the GitHub App installation to get the account (org or user) that authorized the app.
 */
export async function getInstallationAccount(installationId: string): Promise<{
	login: string;
	type: "Organization" | "User";
} | null> {
	const jwt = createAppJwt();
	const res = await fetch(`${GITHUB_API}/app/installations/${installationId}`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
	if (!res.ok) return null;
	const data = (await res.json()) as {
		account?: { login?: string; type?: string };
	};
	const account = data.account;
	if (!account || typeof account.login !== "string") return null;
	const type = account.type === "Organization" || account.type === "User" ? account.type : "User";
	return { login: account.login, type };
}

/**
 * Upserts the installation so we know this organization (or user) has authorized Perceo once.
 * Enables adding more repos from the same org without sending the user to GitHub again.
 */
export async function upsertGitHubInstallation(installationId: string, accountLogin: string, accountType: "Organization" | "User"): Promise<boolean> {
	const client = getSupabaseServiceClient() ?? getSupabaseClient();
	if (!client) return false;
	const now = new Date().toISOString();
	const { error } = await client.from("github_installations").upsert(
		{
			installation_id: Number(installationId),
			account_login: accountLogin.toLowerCase(),
			account_type: accountType,
			updated_at: now,
		},
		{
			onConflict: "installation_id",
			ignoreDuplicates: false,
		},
	);
	return !error;
}

/**
 * Returns the installation_id for an account (org or user login), or null if not yet authorized.
 */
export async function getInstallationIdForAccount(owner: string): Promise<string | null> {
	const client = getSupabaseServiceClient() ?? getSupabaseClient();
	if (!client) return null;
	const { data, error } = await client.from("github_installations").select("installation_id").eq("account_login", owner.toLowerCase()).maybeSingle();
	if (error || !data) return null;
	return String(data.installation_id);
}

/**
 * Ensures a github-actions API key for the project; returns the plain key or null.
 * The table has a unique constraint on (project_id, name), so we update the existing row
 * when present instead of inserting a second one.
 */
export async function ensureProjectApiKey(projectId: string): Promise<string | null> {
	const client = getSupabaseServiceClient() ?? getSupabaseClient();
	if (!client) return null;

	const key = `prc_${randomBytes(32).toString("base64url")}`;
	const keyHash = await bcrypt.hash(key, 10);
	const keyPrefix = key.substring(0, KEY_PREFIX_LENGTH);
	const row = {
		key_hash: keyHash,
		key_prefix: keyPrefix,
		scopes: [...GITHUB_ACTIONS_SCOPES],
		revoked_at: null,
		revocation_reason: null,
	};

	// One row per (project_id, name): update if exists, otherwise insert
	const { data: existing } = await client.from("project_api_keys").select("id").eq("project_id", projectId).eq("name", "github-actions").maybeSingle();

	if (existing) {
		const { error } = await client.from("project_api_keys").update(row).eq("id", existing.id);
		if (error) {
			console.error("[github-setup] ensureProjectApiKey update failed:", error.message, error.code, error.details);
			return null;
		}
		return key;
	}

	const { error } = await client.from("project_api_keys").insert({
		project_id: projectId,
		name: "github-actions",
		...row,
	});
	if (error) {
		console.error("[github-setup] ensureProjectApiKey insert failed:", error.message, error.code, error.details);
		return null;
	}
	return key;
}

async function encryptSecretForGitHub(publicKeyBase64: string, secretValue: string): Promise<string> {
	await sodium.ready;
	const binkey = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
	const binsec = sodium.from_string(secretValue);
	const encBytes = sodium.crypto_box_seal(binsec, binkey);
	return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}

export async function setRepoSecret(installationId: string, owner: string, repo: string, apiKeyValue: string): Promise<void> {
	const jwt = createAppJwt();
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
		throw new Error(`GitHub token: ${tokenRes.status} ${text}`);
	}
	const tokenData = (await tokenRes.json()) as { token?: string };
	const token = tokenData.token;
	if (!token) throw new Error("GitHub token response missing token");

	const keyRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/public-key`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
	if (!keyRes.ok) {
		const text = await keyRes.text();
		throw new Error(`GitHub public key: ${keyRes.status} ${text}`);
	}
	const keyData = (await keyRes.json()) as { key?: string; key_id?: string };
	const { key: publicKey, key_id: keyId } = keyData;
	if (!publicKey || !keyId) throw new Error("GitHub public key response missing key or key_id");

	const encryptedValue = await encryptSecretForGitHub(publicKey, apiKeyValue);

	const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/${SECRET_NAME}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			encrypted_value: encryptedValue,
			key_id: keyId,
		}),
	});
	if (!putRes.ok) {
		const text = await putRes.text();
		throw new Error(`GitHub create secret: ${putRes.status} ${text}`);
	}
}

/**
 * Builds the GitHub App install URL with optional state. Use when the org has not authorized yet.
 */
export function getInstallUrl(state?: DecodedState): string | null {
	const base = process.env.PERCEO_GITHUB_APP_INSTALL_URL;
	if (!base) return null;
	const url = base.endsWith("/installations/new") ? base : `${base.replace(/\/$/, "")}/installations/new`;
	return state ? `${url}?state=${encodeState(state)}` : url;
}
