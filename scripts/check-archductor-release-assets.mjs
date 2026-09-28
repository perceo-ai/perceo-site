#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const usage = `Usage: npm run check:archductor-release -- --version VERSION [--download-dir DIR]

Checks that a conductor-arch GitHub release has the package assets needed before
publishing the Perceo-owned APT and DNF repositories.

Options:
  --version VERSION      Release version without leading v, for example 0.8.3.
  --download-dir DIR     Download package assets and verify checksum manifests.
  -h, --help             Show this help.
`;

const repo = "perceo-ai/conductor-arch";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = { version: "", downloadDir: "" };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--version") {
      parsed.version = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--download-dir") {
      parsed.downloadDir = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "-h" || arg === "--help") {
      console.log(usage);
      process.exit(0);
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }

  if (!/^\d+\.\d+\.\d+([.-][0-9A-Za-z.-]+)?$/.test(parsed.version)) {
    fail("--version must look like MAJOR.MINOR.PATCH");
  }

  return parsed;
}

function requiredAssets(version) {
  return {
    cli: [
      `archductor_${version}-1_amd64.deb`,
      `archductor-${version}-1.x86_64.rpm`,
    ],
    desktop: [
      `archductor-desktop_${version}_amd64.deb`,
      `archductor-desktop-${version}.x86_64.rpm`,
    ],
    checksums: [
      "SHA256SUMS",
      "SHA256SUMS-desktop-linux.txt",
    ],
  };
}

async function fetchJson(url) {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "perceo-site-release-check",
  };
  if (process.env.GH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    fail(`GitHub request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function download(asset, destination) {
  const response = await fetch(asset.browser_download_url, {
    headers: { "User-Agent": "perceo-site-release-check" },
  });
  if (!response.ok) {
    fail(`download failed for ${asset.name}: ${response.status} ${response.statusText}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) {
    fail(`downloaded empty asset: ${asset.name}`);
  }
  await writeFile(destination, bytes);
}

function checksum(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function parseManifest(contents) {
  const entries = new Map();
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^([0-9a-fA-F]{64})\s+\*?\.?\/?(.+)$/.exec(trimmed);
    if (match) {
      entries.set(path.basename(match[2]), match[1].toLowerCase());
    }
  }
  return entries;
}

async function verifyDownloaded(downloadDir, names, manifestName) {
  const manifest = parseManifest(await readFile(path.join(downloadDir, manifestName), "utf8"));

  for (const name of names) {
    const filePath = path.join(downloadDir, name);
    const bytes = await readFile(filePath);
    if (bytes.length === 0) {
      fail(`downloaded empty asset: ${name}`);
    }
    const expected = manifest.get(name);
    if (!expected) {
      fail(`${manifestName} has no entry for ${name}`);
    }
    const actual = checksum(bytes);
    if (actual !== expected) {
      fail(`${name} checksum mismatch: expected ${expected}, got ${actual}`);
    }
  }
}

const { version, downloadDir } = parseArgs(process.argv.slice(2));
const release = await fetchJson(`https://api.github.com/repos/${repo}/releases/tags/v${version}`);
const byName = new Map(release.assets.map((asset) => [asset.name, asset]));
const required = requiredAssets(version);
const allRequiredNames = [...required.cli, ...required.desktop, ...required.checksums];
const missing = allRequiredNames.filter((name) => !byName.has(name));

if (missing.length > 0) {
  fail(`release v${version} is missing: ${missing.join(", ")}`);
}

if (downloadDir) {
  await mkdir(downloadDir, { recursive: true });
  for (const name of allRequiredNames) {
    await download(byName.get(name), path.join(downloadDir, name));
  }
  await verifyDownloaded(downloadDir, required.cli, "SHA256SUMS");
  await verifyDownloaded(downloadDir, required.desktop, "SHA256SUMS-desktop-linux.txt");
}

console.log(`archductor v${version} package repository assets: ok`);
