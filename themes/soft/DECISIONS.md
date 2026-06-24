# 决策日志:soft 主题

> 只记录本风格专属的设计判断。通用的放根目录 `DECISIONS.core.md`。
> 格式:`### YYYY-MM-DD — 一句话结论`,最新放最上。

---

### 2026-06-24 — 从 expat-flow 提炼建立 soft 主题
- **背景:** expat-flow 是一个已验证、用户认可的内部工具项目(Next.js + Tailwind)。
- **决定:** 将其视觉系统提炼为 `soft` 主题——中性深色主操作、柔和圆角(8/12/16)、卡片淡阴影、浅彩徽标。
- **来源/证据:** 真实组件 `Button.tsx`(主按钮 slate-800)、`Card.tsx`(rounded-2xl + shadow-sm + border-gray-100)、`Badge.tsx`(bg-*-50/text-*-700/border-*-100)、`globals.css`(页面 #f9fafb、细滚动条)、`Modal.tsx`(rounded-2xl + 毛玻璃遮罩)。
- **适用边界:** 后台 / 内部 SaaS 工具类界面;偏温和、亲和的观感。需要更"硬朗工具感"时用 github 主题。

### 2026-06-24 — 主操作用中性深色而非彩色(本主题)
- **决定:** primary 按钮用 slate-800 深色,danger 用浅红底而非实心红。
- **原因:** 该项目整体几乎无大面积彩色,主操作靠"深"而非"彩"来突出,观感更克制高级。
