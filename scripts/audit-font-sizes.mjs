#!/usr/bin/env node
// audit-font-sizes.mjs
// 检测 font-size 是否超出 token 允许的档位(12/14/16/20/24/32 px)。
// 用法: node design-standard/scripts/audit-font-sizes.mjs [目录...]   (默认 src)
// 退出码 1 = 发现违规。

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const EXTS = new Set([".css", ".scss", ".less", ".js", ".jsx", ".ts", ".tsx", ".vue", ".html"]);
const SKIP_DIR = new Set(["node_modules", "dist", "build", "coverage", ".next", ".nuxt", ".git", "design-standard"]);
const ALLOWED = new Set([12, 14, 16, 20, 24, 32]);

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
          console.log(`${file}:${i + 1}  非法字号 ${px}px(允许 12/14/16/20/24/32,或用 var(--text-*))`);
        }
      }
    });
  }
}

if (violations) {
  console.log(`\n✗ 发现 ${violations} 处越界字号。`);
  process.exit(1);
} else {
  console.log("✓ 字号均在允许档位内。");
}
