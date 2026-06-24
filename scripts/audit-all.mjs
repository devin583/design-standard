#!/usr/bin/env node
// Run every static audit script and return a failing exit code if any audit fails.

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const roots = process.argv.slice(2);
const scripts = [
  "audit-hardcoded-colors.mjs",
  "audit-font-sizes.mjs",
  "audit-radius.mjs",
];

let failed = false;

for (const script of scripts) {
  const code = await run(process.execPath, [join(here, script), ...roots]);
  if (code !== 0) failed = true;
}

process.exit(failed ? 1 : 0);

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", resolve);
    child.on("error", () => resolve(1));
  });
}
