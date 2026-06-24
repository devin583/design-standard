# scripts/ —— 自动审计

把设计标准从「建议」变成「约束」。这些脚本是纯 Node(无依赖),静态扫描源码里的越界写法。

## 用法
```bash
node design-standard/scripts/audit-all.mjs src
```

也可以单独运行:

```bash
node design-standard/scripts/audit-hardcoded-colors.mjs src
node design-standard/scripts/audit-font-sizes.mjs src
node design-standard/scripts/audit-radius.mjs src
```
可传多个目录;不传默认 `src`。发现违规时退出码为 1,适合接进 CI 或 pre-commit。

## 检查项
- `audit-hardcoded-colors.mjs` —— 硬编码 `#hex` / `rgb()/hsl()` / 渐变(应改用 `var(--color-*)`)
- `audit-font-sizes.mjs` —— 越界字号(只允许 12/14/16/20/24/32px)
- `audit-radius.mjs` —— 越界圆角(只允许 4/6px,胶囊 999px)

## 接入 CI(示例,GitHub Actions)
```yaml
- run: node design-standard/scripts/audit-all.mjs src
```

## 局限(重要)
- 「彩色面积 ≤ 8%」**无法静态检测**(需要真实渲染),仍靠人/AI 看截图判断,不在脚本范围。
- 脚本只抓「写法层面」的越界,抓不到「审美层面」的问题——审美仍由原则 + 截图基准 + 人把关。
