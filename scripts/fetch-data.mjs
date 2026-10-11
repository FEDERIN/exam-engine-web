// Downloads the private question bank into `data/` before the build.
//
// The bank is intentionally kept out of this public repository. In CI/CD
// (Vercel) it is fetched from the private data repository using the
// `DATA_REPO_TOKEN` environment variable, then extracted into `data/` so the
// existing static imports and `import.meta.glob` keep working.
//
// Local development does not need the token as long as `data/` already exists
// (it is git-ignored). Use `FORCE_DATA_FETCH=1` to refresh it.

import { spawnSync } from "node:child_process";
import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const dataDir = path.join(rootDir, "data");
const archivePath = path.join(rootDir, ".data-fetch.tar.gz");

const repo = process.env.DATA_REPO ?? "FEDERIN/exam-engine-data";
const ref = process.env.DATA_REPO_REF ?? "main";
const token = process.env.DATA_REPO_TOKEN;
const force = process.env.FORCE_DATA_FETCH === "1";

function hasLocalData() {
  try {
    return readdirSync(dataDir).length > 0;
  } catch {
    return false;
  }
}

if (hasLocalData() && !force) {
  console.log("[fetch-data] data/ already present; skipping download.");
  process.exit(0);
}

if (!token) {
  console.error(
    "[fetch-data] Missing DATA_REPO_TOKEN.\n" +
      "  Provide a token with read access to the private data repository,\n" +
      "  or keep the question bank locally in data/ (git-ignored).",
  );
  process.exit(1);
}

const url = `https://api.github.com/repos/${repo}/tarball/${ref}`;

console.log(`[fetch-data] Downloading ${repo}@${ref}...`);

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "exam-engine-fetch-data",
  },
  redirect: "follow",
});

if (!response.ok || response.body === null) {
  console.error(
    `[fetch-data] GitHub responded ${response.status} ${response.statusText} for ${repo}@${ref}.`,
  );
  process.exit(1);
}

await pipeline(
  Readable.fromWeb(response.body),
  createWriteStream(archivePath),
);

rmSync(dataDir, { recursive: true, force: true });
mkdirSync(dataDir, { recursive: true });

const tar = spawnSync(
  "tar",
  [
    "-xzf",
    archivePath,
    "-C",
    dataDir,
    "--strip-components",
    "1",
    "--exclude",
    "README.md",
    "--exclude",
    ".github",
  ],
  { stdio: "inherit" },
);

rmSync(archivePath, { force: true });

if (tar.status !== 0) {
  console.error("[fetch-data] Failed to extract the data archive.");
  process.exit(1);
}

console.log("[fetch-data] Done. Question bank is ready in data/.");
