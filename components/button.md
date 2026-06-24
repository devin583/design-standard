# Button(按钮)

> 来源:expat-flow `components/ui/Button.tsx`,已在真实业务场景验证。

## 用途

触发一次性写操作或导航动作。不用于切换状态(用 Toggle)、筛选(用 Tab/Chip)。

## 类型

| variant | 用途 | 何时用 |
|---------|------|--------|
| `primary` | 页面主操作 | 每个 surface 最多一个;提交、确认、创建 |
| `secondary` | 次级操作 | 取消、返回、次要选项;与 primary 并列时用 |
| `ghost` | 更低优先级 | 不需要边框的操作;常见于列表行内、图标钮旁 |
| `danger` | 破坏性操作退回/阻塞 | **浅红底+深红字**,不用实心红(过于刺激) |

## 尺寸

| size | radius | 适用场景 |
|------|--------|---------|
| `sm` | `--radius-sm`(8px) | 表格行内操作、密集 UI |
| `md` | `--radius-md`(12px) | 默认;表单尾部操作区 |
| `lg` | `--radius-md`(12px) | 全宽 CTA、移动端主操作 |

## 状态

- **default** / **hover** / **active** — 颜色渐进加深(见 Token 节)
- **focus** — `outline:none` + `ring-2` 聚焦环,颜色用 `--color-focus-ring`
- **disabled** — `opacity-50 cursor-not-allowed`,同时阻止点击
- **loading** — 内部显示转圈 SVG + 强制 `disabled`,**防重复提交**

## 规则

- 每个 surface(卡片、弹窗、页面底部操作区)最多 **1 个 primary**。
- `danger` 操作必须用 `danger` variant,不得用 `primary`。
- loading 状态期间按钮必须 disabled — 见 `interaction/mutation-feedback.md`。
- 按钮文字不换行;若文案过长应缩短文案而非允许折行。

## Token(soft 主题)

```
primary:
  background:  var(--color-primary-emphasis)   /* slate-800 */
  hover:       var(--color-primary-hover)       /* slate-700 */
  active:      var(--color-primary-active)      /* slate-900 */
  color:       var(--color-fg-on-emphasis)      /* white */
  radius:      var(--radius-md)                 /* md/lg; sm 用 --radius-sm */

secondary:
  background:  var(--color-canvas)              /* white */
  border:      1px solid var(--color-border)    /* gray-200 */
  color:       var(--color-fg-muted)            /* gray-600 */
  hover-bg:    var(--color-canvas-subtle)       /* gray-50 */

ghost:
  background:  transparent
  color:       var(--color-fg-muted)
  hover-bg:    var(--color-canvas-inset)        /* gray-100 */

danger:
  background:  var(--color-danger-subtle)       /* red-50 */
  color:       var(--color-danger-fg)           /* red-600 */
  hover-bg:    红 subtle 加深 ~10%

focus-ring:    var(--color-focus-ring)          /* slate-300 */
transition:    var(--transition)                /* 150ms */
```

## Do

- 提交表单 → primary;旁边「取消」→ secondary。
- 删除 / 退回 → danger(`bg-red-50 text-red-600`)。
- loading 期间图标旋转,文案保持原文(不改成"处理中…")。

## Don't

- ❌ 同一区域放两个 primary。
- ❌ danger 用 primary 绿/深色——破坏性操作绝不该最显眼。
- ❌ loading 时不 disabled,导致重复提交。
- ❌ `ghost` 用于主操作——用户找不到。
