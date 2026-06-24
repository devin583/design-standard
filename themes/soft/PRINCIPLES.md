# 主题:soft(中性深色 / 柔和圆角 / 浅彩徽标)

继承 `PRINCIPLES.core.md`。来源:已验证项目 **expat-flow**(Next.js + Tailwind,Claude/coworker 编写)。
数值见同目录 `tokens.css`。

## 风格性格
- **克制但温和**:中性主导,但比 github 主题更圆、更软。
- **主操作 = 中性深色**(slate-800 近黑),不是彩色按钮。整屏几乎看不到大面积彩色。
- **柔和圆角**:卡片 16px、按钮 12px、小元素 8px。
- **极浅边框 + 一层很淡的阴影**:卡片 `border` 用 muted(gray-100)+ `--shadow-sm`。
- **浅彩徽标**:状态用 `subtle` 底 + `fg` 文字 + 对应 `-100` 边框,柔和不刺眼。
- **14px 文字主导**,Inter 字体,页面底色 `#f9fafb`。

## 按钮(直接来自项目 Button 组件)
- **primary** → `--color-primary-emphasis` 底 + 白字;hover `--color-primary-hover`,active `--color-primary-active`。
- **secondary** → 白底 + `--color-border` 边 + `--color-fg-muted` 字;hover 浅灰底。
- **ghost** → 透明底,hover 浅灰底。
- **danger** → `--color-danger-subtle` 底 + `--color-danger-fg` 字(浅红,不是实心红)。
- 尺寸:sm 用 `--radius-sm`,md/lg 用 `--radius-md`;loading 时显示转圈并禁用(见 interaction/mutation-feedback.md)。

## 徽标 / 状态(直接来自 Badge 组件)
统一形态:`subtle` 底 + `fg` 字 + 对应 `--color-badge-border-*` 边框,小圆角或胶囊。
- 进行中 / 链接 → 蓝;已完成 → 绿;待审批 → 琥珀;阻塞 → 红;员工/特殊归属 → 紫;待处理/取消 → 灰。

## 卡片 / 弹窗
- 卡片:白底 + `--color-border-muted` 边 + `--radius-lg` + `--shadow-sm`,padding 16/20/24。
- 弹窗:`--radius-lg` + `--shadow-overlay`,遮罩 `rgba(0,0,0,.25)` + 轻微毛玻璃;头/脚用 `--color-border-muted` 分隔。

## 与 github 主题的差异边界(重要)
本主题**有意**在以下点偏离 github 主题,切换主题时注意:
- 圆角更大(8/12/16 vs 4/6)。
- 卡片允许淡阴影(github 禁阴影、纯靠边框)。
- 主操作是中性深色(github 是绿色)。
> 这些差异属于「主题层」,不违反核心原则(仍然中性主导、彩色只用于小徽标、只用 token)。

## 审计注意
本主题使用 8/12/16 圆角和 18px 小标题。运行审计时使用:

```bash
AUDIT_THEME=soft node design-standard/scripts/audit-all.mjs
```

首次接入历史项目时先用同一主题建立 baseline:

```bash
AUDIT_THEME=soft node design-standard/scripts/audit-all.mjs --update-baseline
```
