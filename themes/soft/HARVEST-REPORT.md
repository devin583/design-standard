# HARVEST 提炼报告 — expat-flow → soft 主题

> 按 `HARVEST.md` 流程产出。本报告是「提炼依据 + 待你确认事项」的留档。

## 一、已提炼进 soft 主题的内容

| 条目 | 证据来源 | 适用边界 |
|---|---|---|
| 中性色阶 / 页面底 #f9fafb / 细滚动条 | `globals.css` | 通用 |
| 中性深色主操作(slate-800) | `Button.tsx` primary | 后台工具类,偏克制温和 |
| 按钮四型(primary/secondary/ghost/danger)+ loading 禁用 | `Button.tsx` | 通用(loading 行为对接 interaction 规范) |
| 柔和圆角 8/12/16 | Button/Card/Modal 的 lg/xl/2xl | soft 主题专属 |
| 卡片:浅边框 + shadow-sm + 16px 圆角 | `Card.tsx` | soft 主题专属 |
| 浅彩徽标体系(subtle底/fg字/-100边) | `Badge.tsx` | 通用配色习惯 |
| 弹窗:大圆角 + 毛玻璃遮罩 | `Modal.tsx` | soft 主题 |

## 二、刻意没有提炼的

- **业务字段 / 数据结构**(events、users、event_steps 等)→ 项目特有,非视觉标准。
- **具体页面布局**(admin/hr/dashboard 的字段排布)→ 若以后要沉淀为 `patterns/`,需要单独看页面截图再提炼,本轮不做。

## 三、集成决策

1. **主题命名:** 保留 `soft`。它描述的是中性深色主操作、柔和圆角、浅彩徽标的整体气质,比项目名 `expat` 更可泛化。

2. **审计配置已主题化:** `scripts/audit-config.json` 支持 `github` 和 `soft`;消费项目可用 `AUDIT_THEME=soft` 指定圆角 / 字号档位。

3. **跨主题契约已回填:** `--color-primary-*`、`--radius-lg`、`--shadow-sm`、`--space-8`、`--color-badge-border-*`、滚动条变量已补到 `github` 和 `_template`。

4. **Inter 字体:** 保留。它来自已验证项目的真实选择;若未来多个 soft 项目显示字体同质化,再作为主题决策调整。

## 四、建议的下一步
- 在一个适合温和 SaaS / 内部工具气质的项目中切到 `themes/soft`。
- 用 `AUDIT_THEME=soft node design-standard/scripts/audit-all.mjs --update-baseline` 建立该项目 baseline。
- 跑一次真实页面截图审查,再决定是否把页面级模式沉淀进 `patterns/`。
