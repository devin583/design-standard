#!/usr/bin/env node
// Unified static audit with baseline ratcheting.
//
// The baseline belongs to the consuming project, not the design-standard
// submodule. Run from the project root:
//   node design-standard/scripts/audit-all.mjs --update-baseline
//   node design-standard/scripts/audit-all.mjs
//   node design-standard/scripts/audit-all.mjs --report

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(await readFile(join(here, "audit-config.json"), "utf8"));

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const rootArgs = args.filter((arg) => !arg.startsWith("--"));

const roots = rootArgs.length ? rootArgs : (cfg.scan?.length ? cfg.scan : ["src"]);
const baselinePath = resolve(process.cwd(), cfg.baselineFile || ".audit-baseline.json");
const exts = new Set(cfg.exts || []);
const skipDirs = new Set(cfg.skipDirs || []);

const hex = /#[0-9a-fA-F]{3,8}\b/g;
const colorFunc = /\b(rgb|rgba|hsl|hsla)\s*\(/g;
const gradient = /\b(linear|radial|conic)-gradient\s*\(/g;
const fontSize = /font-size\s*:\s*([0-9.]+)px/gi;
const radius = /border-radius\s*:\s*([0-9.]+)px/gi;

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) await walk(path, out);
    } else if (exts.has(extname(entry.name))) {
      out.push(path);
    }
  }

  return out;
}

function scanLine(line, rules) {
  const found = [];

  if (rules.hardcodedColors?.enabled) {
    for (const re of [hex, colorFunc, gradient]) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(line))) {
        found.push({ rule: "hardcodedColors", value: match[0] });
      }
    }
  }

  if (rules.fontSizes) {
    const allowed = new Set(rules.fontSizes.allowedPx || []);
    fontSize.lastIndex = 0;
    let match;
    while ((match = fontSize.exec(line))) {
      const px = parseFloat(match[1]);
      if (!allowed.has(px)) found.push({ rule: "fontSizes", value: `${px}px` });
    }
  }

  if (rules.radius) {
    const allowed = new Set(rules.radius.allowedPx || []);
    const pillMin = rules.radius.pillMinPx ?? 100;
    radius.lastIndex = 0;
    let match;
    while ((match = radius.exec(line))) {
      const px = parseFloat(match[1]);
      if (!allowed.has(px) && px < pillMin) {
        found.push({ rule: "radius", value: `${px}px` });
      }
    }
  }

  return found;
}

async function scan() {
  const violations = [];

  for (const root of roots) {
    let rootStat;
    try {
      rootStat = await stat(root);
    } catch {
      continue;
    }

    const files = rootStat.isDirectory() ? await walk(root) : [root];
    for (const file of files) {
      const normalized = normalize(file);
      if (normalized.endsWith(`${sep}tokens.css`)) continue;

      const text = await readFile(file, "utf8");
      text.split("\n").forEach((line, index) => {
        for (const violation of scanLine(line, cfg.rules || {})) {
          violations.push({
            ...violation,
            file: normalize(file).split(sep).join("/"),
            line: index + 1,
            snippet: line.trim().replace(/\s+/g, " "),
          });
        }
      });
    }
  }

  return violations;
}

function countByRuleAndFile(violations) {
  const counts = {};
  for (const violation of violations) {
    counts[violation.rule] ??= {};
    counts[violation.rule][violation.file] = (counts[violation.rule][violation.file] || 0) + 1;
  }
  return counts;
}

function totalByRule(counts) {
  return Object.fromEntries(
    Object.entries(counts).map(([rule, files]) => [
      rule,
      Object.values(files).reduce((sum, count) => sum + count, 0),
    ]),
  );
}

function countByFingerprint(violations) {
  const fingerprints = {};
  for (const violation of violations) {
    const key = [
      violation.rule,
      violation.file,
      violation.value,
      violation.snippet,
    ].join("\t");
    fingerprints[key] = (fingerprints[key] || 0) + 1;
  }
  return fingerprints;
}

function parseFingerprint(key) {
  const [rule, file, value, snippet] = key.split("\t");
  return { rule, file, value, snippet };
}

const violations = await scan();
const counts = countByRuleAndFile(violations);
const fingerprints = countByFingerprint(violations);
const totals = totalByRule(counts);

if (flags.has("--report")) {
  for (const violation of violations) {
    console.log(`${violation.file}:${violation.line}  [${violation.rule}] ${violation.value}`);
  }
  console.log(`\n合计: ${JSON.stringify(totals)}`);
  process.exit(0);
}

if (flags.has("--update-baseline")) {
  await writeFile(
    baselinePath,
    JSON.stringify({ generatedAt: new Date().toISOString(), counts, totals, fingerprints }, null, 2) + "\n",
  );
  console.log(`已写入 baseline -> ${baselinePath}`);
  console.log(`合计: ${JSON.stringify(totals)}`);
  process.exit(0);
}

let baseline = { counts: {}, totals: {}, fingerprints: {} };
let hasBaseline = true;

try {
  baseline = JSON.parse(await readFile(baselinePath, "utf8"));
} catch {
  hasBaseline = false;
  console.log("未找到 baseline。首次接入历史项目请先运行:");
  console.log("  node design-standard/scripts/audit-all.mjs --update-baseline\n");
}

const baselineFingerprints = baseline.fingerprints || {};
const regressions = [];
for (const [fingerprint, current] of Object.entries(fingerprints)) {
  const previous = baselineFingerprints[fingerprint] || 0;
  if (current > previous) {
    regressions.push({ ...parseFingerprint(fingerprint), previous, current, delta: current - previous });
  }
}

const improvements = [];
for (const [fingerprint, previous] of Object.entries(baselineFingerprints)) {
  const current = fingerprints[fingerprint] || 0;
  if (current < previous) improvements.push({ ...parseFingerprint(fingerprint), previous, current });
}

if (regressions.length) {
  console.log("新增违规:");
  for (const item of regressions.slice(0, 50)) {
    console.log(`  [${item.rule}] ${item.file} ${item.value}  ${item.previous} -> ${item.current} (+${item.delta})`);
    if (item.snippet) console.log(`    ${item.snippet}`);
  }
  if (regressions.length > 50) console.log(`  ...另有 ${regressions.length - 50} 条`);
  console.log("\n请修复新增项;如确为有意接受,再运行 --update-baseline。");
}

if (improvements.length) {
  console.log(`\n有 ${improvements.length} 条违规较 baseline 改善。修复确认后运行 --update-baseline 锁定收益。`);
}

console.log(`\n当前合计: ${JSON.stringify(totals)}   baseline: ${JSON.stringify(baseline.totals || {})}`);
process.exit(regressions.length && hasBaseline ? 1 : 0);
