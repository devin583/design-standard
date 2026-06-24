# Badge(徽标)

> 来源:expat-flow `components/ui/Badge.tsx`,双徽标体系(状态 + 角色)已验证。

## 用途

用于**小面积**传达两类信息:

1. **状态徽标(StatusBadge)** — 记录表达一条数据当前处于什么阶段(进行中、已完成、阻塞…)
2. **角色徽标(RoleBadge)** — 标注某步骤或操作由谁负责(员工、HR、管理员)

不用于:大面积区域标记(用边框/背景)、操作触发(用 Button)、数字计数(用 Count chip)。

## 形态(唯一)

```
subtle底色 + fg文字 + 1px 对应 -100 边框 + 胶囊圆角(--radius-pill)
内边距: 2px 水平 --space-2(8px)
字号: --text-meta(12px) font-medium
```

⚠ **徽标只有这一种形态,不存在实心(emphasis)版本的徽标。**  
实心色块用于状态点(`status-dot`)或主按钮,不用于徽标。

## 状态徽标色值(soft 主题)

| status key | 语义 | bg | text | border |
|---|---|---|---|---|
| `completed` | 已完成 | `--color-success-subtle` | `--color-success-fg` | `--color-badge-border-success` |
| `in_progress` | 进行中 | `--color-accent-subtle` | `--color-accent-fg` | `--color-badge-border-accent` |
| `pending` | 待处理 | `--color-canvas-inset`(gray-100) | `--color-fg-subtle` | `--color-border-muted` |
| `blocked` | 已阻塞 | `--color-danger-subtle` | `--color-danger-fg` | `--color-badge-border-danger` |
| `active` | 进行中(事件级) | `--color-canvas-inset` | `--color-fg-muted` | `--color-border` |
| `pending_approval` | 待审批 | `--color-attention-subtle` | `--color-attention-fg` | `--color-badge-border-attention` |
| `cancelled` | 已取消 | `--color-canvas-inset` | `--color-fg-subtle` | `--color-border-muted` |
| `on_hold` | 已暂停 | orange-50 近似 | orange-600 近似 | orange-100 |

> `on_hold` 暂用 Tailwind `orange` 系;如需 token 化可扩展一个 `--color-pause-*`。

## 角色徽标色值(soft 主题 · workflow 工具专用)

| role key | 语义 | bg | text | border |
|---|---|---|---|---|
| `employee` | 员工负责 | `--color-done-subtle` | `--color-done-fg` | `--color-badge-border-done` |
| `hr` | HR 负责 | `--color-role-subtle` | `--color-role-fg` | `--color-badge-border-role` |
| `admin` | 管理员负责 | `--color-canvas-subtle` | `--color-fg-muted` | `--color-border` |

> 角色色与状态色**有意分开**:角色是中性归属,不代表好坏,使用"不常见"的紫/天蓝让用户快速区分"这是角色标签,不是状态"。

## 规则

- 徽标只用 subtle 底色 —— **禁止 emphasis 实心底色**。
- 不允许单独显示角色徽标而没有状态徽标(角色是补充信息,不是主信息)。
- 同一行内徽标数量建议 ≤ 2 个;信息太多时折叠进 tooltip。
- 徽标文字不超过 6 个汉字 / 8 个英文字符;超出截断加 `…`。
- 只在**列表行 / 表头附近 / 详情元信息区**使用;不在大标题旁放徽标。

## Token(soft 主题)

```
形状:
  border-radius: var(--radius-pill)
  border:        1px solid <对应 badge-border 变量>
  padding:       2px var(--space-2)
  font-size:     var(--text-meta)      /* 12px */
  font-weight:   var(--weight-medium)  /* 500 */
```

## Do

- 事件列表行末 `[进行中]` + `[HR 负责]` 各一个。
- 流程步骤标题旁用角色徽标快速标注谁来处理。

## Don't

- ❌ 用 `bg-blue-500 text-white` 实心徽标 —— 与状态点混淆,且视觉过重。
- ❌ 一行放 3 个及以上徽标 —— 噪音大于信息。
- ❌ 用徽标作为操作按钮 —— 用 Button。
