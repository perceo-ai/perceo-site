import { NextRequest, NextResponse } from "next/server";
import {
	encodeState,
	ensureProjectApiKey,
	getInstallationIdForAccount,
	getInstallUrl,
	setRepoSecret,
	type DecodedState,
} from "@/lib/github-setup";

const LOG = (msg: string, ...args: unknown[]) =>
	console.log("[configure-repo]", msg, ...args);
const LOG_ERR = (msg: string, ...args: unknown[]) =>
	console.error("[configure-repo]", msg, ...args);

/**
 * POST /api/github/configure-repo
 *
 * Configures a repo with PERCEO_API_KEY using an existing GitHub App installation
 * for the same organization. Users authorize once per organization; additional
 * repos in that org can be configured without going through the install flow again.
 *
 * Body: { projectId: string, owner: string, repo: string }
 *
 * - If the org is already authorized: creates/gets project API key, sets repo secret, returns success.
 * - If not: returns 404 with needInstall: true and installUrl + state so the client can redirect.
 */
export async function POST(request: NextRequest) {
	let body: { projectId?: string; owner?: string; repo?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid JSON body" },
			{ status: 400 },
		);
	}

	const { projectId, owner, repo } = body;
	if (
		typeof projectId !== "string" ||
		typeof owner !== "string" ||
		typeof repo !== "string" ||
		!projectId ||
		!owner ||
		!repo
	) {
		return NextResponse.json(
			{ error: "Missing or invalid projectId, owner, or repo" },
			{ status: 400 },
		);
	}

	LOG("POST: configure", { projectId, owner, repo });

	const installationId = await getInstallationIdForAccount(owner);
	if (!installationId) {
		const state: DecodedState = { projectId, owner, repo };
		const installUrl = getInstallUrl(state);
		LOG("POST: org not authorized, need install", { owner });
		return NextResponse.json(
			{
				needInstall: true,
				installUrl: installUrl ?? undefined,
				state: installUrl ? undefined : encodeState(state),
			},
			{ status: 404 },
		);
	}

	const apiKey = await ensureProjectApiKey(projectId);
	if (!apiKey) {
		LOG_ERR("POST: no_key for project", projectId);
		return NextResponse.json(
			{ error: "Could not create or find API key for this project" },
			{ status: 500 },
		);
	}

	try {
		await setRepoSecret(installationId, owner, repo, apiKey);
	} catch (err) {
		LOG_ERR("POST: github_error", err instanceof Error ? err.message : err);
		return NextResponse.json(
			{ error: "Failed to set repository secret in GitHub" },
			{ status: 502 },
		);
	}

	LOG("POST: success", { owner, repo });
	return NextResponse.json({
		ok: true,
		repo: `${owner}/${repo}`,
	});
}
