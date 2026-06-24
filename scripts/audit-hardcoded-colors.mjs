#!/usr/bin/env node
// audit-hardcoded-colors.mjs
// 检测源码里有没有硬编码颜色 / 渐变(应改用 tokens.css 的变量)。
// 用法: node design-standard/scripts/audit-hardcoded-colors.mjs [目录...]   (默认 src)
// 退出码 1 = 发现违规。

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname, normalize, sep } from "node:path";

const TARGETS = process.argv.slice(2);
const ROOTS = TARGETS.length ? TARGETS : ["src"];
const EXTS = new Set([".css", ".scss", ".less", ".js", ".jsx", ".ts", ".tsx", ".vue", ".html"]);
const SKIP_DIR = new Set(["node_modules", "dist", "build", "coverage", ".next", ".nuxt", ".git", "design-standard"]);

// 命中:hex 颜色、rgb()/rgba()/hsl()/hsla()、linear/radial-gradient
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC = /\b(rgb|rgba|hsl|hsla)\s*\(/g;
const GRAD = /\b(linear|radial|conic)-gradient\s*\(/g;

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      await walk(join(dir, e.name), out);
    } else if (EXTS.has(extname(e.name))) {
      out.push(join(dir, e.name));
    }
  }
  return out;
}

let violations = 0;
for (const root of ROOTS) {
  let s; try { s = await stat(root); } catch { continue; }
  const files = s.isDirectory() ? await walk(root) : [root];
  for (const file of files) {
    const normalized = normalize(file);
    if (normalized.endsWith(`${sep}tokens.css`)) continue;
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, i) => {
      if (line.includes("var(--")) {
        // 行内若全是变量则跳过纯 var 行的误报;仍检测同行混用的字面量
      }
      const hits = [];
      for (const re of [HEX, FUNC, GRAD]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line))) hits.push(m[0]);
      }
      if (hits.length) {
        violations++;
        console.log(`${file}:${i + 1}  硬编码颜色/渐变 → ${[...new Set(hits)].join(", ")}`);
      }
    });
  }
}

if (violations) {
  console.log(`\n✗ 发现 ${violations} 处硬编码颜色/渐变。请改用 tokens.css 的变量,例如 var(--color-...)。`);
  process.exit(1);
} else {
  console.log("✓ 未发现硬编码颜色。");
}
