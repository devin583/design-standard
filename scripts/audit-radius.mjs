#!/usr/bin/env node
// audit-radius.mjs
// 检测 border-radius 是否超出 token 允许范围(4 / 6 px,胶囊 999px / 50%)。
// 大圆角卡片(>8px)是常见的「软/玩具感」来源。
// 用法: node design-standard/scripts/audit-radius.mjs [目录...]   (默认 src)
// 退出码 1 = 发现违规。

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const EXTS = new Set([".css", ".scss", ".less", ".js", ".jsx", ".ts", ".tsx", ".vue", ".html"]);
const SKIP_DIR = new Set(["node_modules", "dist", "build", "coverage", ".next", ".nuxt", ".git", "design-standard"]);
const ALLOWED = new Set([0, 4, 6, 999]); // px;50% / 9999 等胶囊形另行放行

const RE = /border-radius\s*:\s*([0-9.]+)px/gi;

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
        if (!ALLOWED.has(px) && px < 100) { // <100 视为普通圆角;>=100 视为胶囊,放行
          violations++;
          console.log(`${file}:${i + 1}  非法圆角 ${px}px(允许 4/6,胶囊用 999px;用 var(--radius-*))`);
        }
      }
    });
  }
}

if (violations) {
  console.log(`\n✗ 发现 ${violations} 处越界圆角。大圆角会带来「软/玩具感」。`);
  process.exit(1);
} else {
  console.log("✓ 圆角均在允许范围内。");
}
