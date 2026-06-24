# 消费项目 AGENTS.md 片段

把下面内容复制到消费项目根目录的 `AGENTS.md`,并按项目实际情况修改“当前主题”。

```md
## UI 设计标准

本项目引用共享设计标准仓库:

- 当前设计标准: `design-standard/`
- 当前主题: `themes/github`

改动 UI 前必须读取:

1. `design-standard/PRINCIPLES.core.md`
2. `design-standard/DECISIONS.core.md`
3. `design-standard/<当前主题>/tokens.css`
4. `design-standard/<当前主题>/PRINCIPLES.md`
5. `design-standard/<当前主题>/DECISIONS.md`

硬性要求:

- 颜色 / 间距 / 字号 / 圆角只能引用当前主题 `tokens.css` 的变量,禁止在组件里写死 `#hex` 或随手像素。
- 禁止用彩色背景填充卡片或区域;颜色只用于状态、小徽标、链接和主操作按钮。
- 区域靠 1px 边框和留白区分,不靠颜色块或阴影。
- 较大的视觉改动先输出审计和方案,确认后再改代码。

改完 UI 后报告自检结果:

- 彩色面积是否 <= 8%
- 字号是否 <= 6 档
- 字重是否 <= 3 档
- 间距是否是 4 的倍数且来自 token
- 是否无彩色背景区域 / 卡片
- 灰度下层级是否仍清晰

反哺分流:

- 只跟本项目有关 -> 写进本项目根目录 `DECISIONS.local.md`
- 适用于当前主题所有项目 -> 写进 `design-standard/<当前主题>/DECISIONS.md` 或修改该主题 `tokens.css`
- 适用于所有主题 -> 写进 `design-standard/PRINCIPLES.core.md` 或 `design-standard/DECISIONS.core.md`
- 拿不准时先问,默认按“只跟本项目有关”处理
```
