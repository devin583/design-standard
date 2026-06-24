#!/usr/bin/env node
// audit-font-sizes.mjs
// 检测 font-size 是否超出当前审计主题允许的 token 档位。
// 用法: node design-standard/scripts/audit-font-sizes.mjs [目录...]   (默认 src)
// 退出码 1 = 发现违规。

import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOTS = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const here = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(await readFile(join(here, "audit-config.json"), "utf8"));
const activeTheme = process.env.AUDIT_THEME || cfg.activeTheme || "github";
const theme = cfg.themes?.[activeTheme];

if (!theme) {
  console.error(`未知审计主题: ${activeTheme}`);
  console.error(`可用主题: ${Object.keys(cfg.themes || {}).join(", ") || "(none)"}`);
  process.exit(2);
}

const EXTS = new Set(cfg.exts || []);
const SKIP_DIR = new Set(cfg.skipDirs || []);
const ALLOWED = new Set(theme.fontSizes?.allowedPx || []);
const allowedLabel = [...ALLOWED].sort((a, b) => a - b).join("/");

const RE = /font-size\s*:\s*([0-9.]+)px/gi;

async function walk(dir, out = []) {
  let entries; try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) await walk(join(dir, e.name), out); }
    else if (EXTS.has(extname(e.name))) out.push(join(dir, e.name));
  }
  return out;
}

let violations = 0;
for (const root of ROOTS) {
  let s; try { s = await stat(root); } catch { continue; }
  const files = s.isDirectory() ? await walk(root) : [root];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, i) => {
      RE.lastIndex = 0; let m;
      while ((m = RE.exec(line))) {
        const px = parseFloat(m[1]);
        if (!ALLOWED.has(px)) {
          violations++;
          console.log(`${file}:${i + 1}  非法字号 ${px}px(主题 ${activeTheme} 允许 ${allowedLabel},或用 var(--text-*))`);
        }
      }
    });
  }
}

if (violations) {
  console.log(`\n✗ 发现 ${violations} 处越界字号。`);
  process.exit(1);
} else {
  console.log(`✓ 字号均在 ${activeTheme} 主题允许档位内。`);
}
