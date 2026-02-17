import { NextRequest, NextResponse } from "next/server";
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import sodium from "libsodium-wrappers";
import { createClient } from "@supabase/supabase-js";

const GITHUB_API = "https://api.github.com";
const SECRET_NAME = "PERCEO_API_KEY";

type DecodedState = { projectId: string; owner: string; repo: string };

function decodeState(state: string | null): DecodedState | null {
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
		// invalid state
	}
	return null;
}

function getPrivateKey(): string {
	const path = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY_PATH;
	if (path) {
		return readFileSync(path, "utf8");
	}
	const raw = process.env.PERCEO_GITHUB_APP_PRIVATE_KEY ?? "";
	return raw.replace(/\\n/g, "\n");
}

function createAppJwt(): string {
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

async function getProjectApiKey(projectId: string): Promise<string | null> {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		console.error("Supabase not configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing");
		return null;
	}
	const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
	const { data, error } = await supabase.from("projects_api_keys").select("value").eq("project_id", projectId).eq("name", "github-actions").maybeSingle();
	if (error) {
		console.error("Supabase api_keys lookup failed:", error.message);
		return null;
	}
	return data?.value ?? null;
}

async function encryptSecretForGitHub(publicKeyBase64: string, secretValue: string): Promise<string> {
	await sodium.ready;
	const binkey = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
	const binsec = sodium.from_string(secretValue);
	const encBytes = sodium.crypto_box_seal(binsec, binkey);
	return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}

async function setRepoSecret(installationId: string, owner: string, repo: string, apiKeyValue: string): Promise<void> {
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
	const { token } = (await tokenRes.json()) as { token: string };
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
	const { key: publicKey, key_id: keyId } = (await keyRes.json()) as { key: string; key_id: string };
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
		body: JSON.stringify({ encrypted_value: encryptedValue, key_id: keyId }),
	});
	if (!putRes.ok) {
		const text = await putRes.text();
		throw new Error(`GitHub create secret: ${putRes.status} ${text}`);
	}
}

function redirectTo(baseUrl: URL, path: string, params?: Record<string, string>): NextResponse {
	const url = new URL(path, baseUrl.origin);
	if (params) {
		for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	}
	return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
	const baseUrl = new URL(request.url);
	const { searchParams } = baseUrl;
	const installationId = searchParams.get("installation_id");
	const state = searchParams.get("state");

	const decoded = decodeState(state);
	if (!decoded || !installationId) {
		return redirectTo(baseUrl, "/setup", { error: "invalid_callback" });
	}

	const apiKey = await getProjectApiKey(decoded.projectId);
	if (!apiKey) {
		return redirectTo(baseUrl, "/setup", { error: "no_key" });
	}

	try {
		await setRepoSecret(installationId, decoded.owner, decoded.repo, apiKey);
	} catch (err) {
		console.error("GitHub setup callback error:", err);
		return redirectTo(baseUrl, "/setup", { error: "github_error" });
	}

	return redirectTo(baseUrl, "/setup/complete", {
		repo: `${decoded.owner}/${decoded.repo}`,
	});
}
