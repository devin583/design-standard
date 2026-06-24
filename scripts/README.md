# scripts/ —— 自动审计

把设计标准从「建议」变成「约束」。纯 Node(无依赖),静态扫描源码里的越界写法。

## 推荐:统一审计 + baseline

历史项目往往已有大量违规。直接接 CI 会被历史欠债打爆,所以用 baseline:先把现有违规记录下来,之后只对新增违规失败。每修一批历史问题,就重跑 baseline,把标准往下棘轮收紧。

```bash
# 首次接入:把现有违规记为基线
node design-standard/scripts/audit-all.mjs --update-baseline

# 之后每次检查:只要没有新增违规就通过
node design-standard/scripts/audit-all.mjs

# soft 主题项目
AUDIT_THEME=soft node design-standard/scripts/audit-all.mjs

# 修好一批历史问题后,锁定收益
node design-standard/scripts/audit-all.mjs --update-baseline

# 只看全部违规,不对比 baseline,退出码仍为 0
node design-standard/scripts/audit-all.mjs --report
```

- 配置在 `design-standard/scripts/audit-config.json`。
- 默认审计主题是 `github`;可用环境变量覆盖,例如 `AUDIT_THEME=soft`。
- baseline 默认写在当前项目根目录 `.audit-baseline.json`,应提交进消费项目仓库。
- 可传扫描目录覆盖配置里的默认 `src`,例如 `node design-standard/scripts/audit-all.mjs app components`。

## 快速单项检查

单项脚本不使用 baseline,发现违规时直接退出码为 1。它们同样读取 `AUDIT_THEME`。

```bash
node design-standard/scripts/audit-hardcoded-colors.mjs src
node design-standard/scripts/audit-font-sizes.mjs src
node design-standard/scripts/audit-radius.mjs src
```

## 检查项

- `audit-hardcoded-colors.mjs` —— 硬编码 `#hex` / `rgb()/hsl()` / 渐变(应改用 `var(--color-*)`)
- `audit-font-sizes.mjs` —— 越界字号(只允许 12/14/16/20/24/32px)
- `audit-radius.mjs` —— 越界圆角(只允许 4/6px,胶囊 999px)

## 接入 CI

```yaml
- run: node design-standard/scripts/audit-all.mjs
```

没有 baseline 时,脚本会提示先运行 `--update-baseline`,但不会失败;建立 baseline 后,新增违规会失败。

## 局限

- “彩色面积 <= 8%”无法静态检测,需要真实渲染,仍靠截图 + 人/AI 判断。
- 脚本只抓写法层面的越界,抓不到审美层面的问题;审美仍由原则 + 截图基准 + 人把关。
