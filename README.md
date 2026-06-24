# design-standard

可跨项目复用、能跟着项目反馈持续迭代的 UI 设计标准。它不是组件库,也不是 Figma 源文件;它的作用是给 Codex / AI 编码助手和项目代码提供同一套可检查的视觉约束、主题 token 和决策日志。

## 适合做什么

- 让多个项目共享同一套 UI 判断标准,减少每次从零纠正。
- 把“这次我不喜欢”沉淀成可复用的原则、主题规则或 token。
- 让 AI 改 UI 前有明确依据:先读 core,再读当前 theme,最后按项目局部规则执行。
- 让不同项目按需引用同一个主题,后续把通用修正反哺回来。

## 不适合做什么

- 不提供现成 React / Vue / SwiftUI 组件。
- 不替代项目自己的产品信息架构和交互设计。
- 不自动保证所有 UI 合规;仍需要代码审查、视觉检查或自动化规则配合。

## 结构
```
design-standard/
  PRINCIPLES.core.md        # 跨风格通用原则 + 硬规则(很少改)
  DECISIONS.core.md         # 跨风格通用决策
  AGENTS.md                 # 给 Codex 的指令(含主题选择 + 反哺分流)
  README.md
  themes/
    github/                 # 风格1:克制专业(默认)
      tokens.css            #   颜色/间距/字号的唯一数值来源
      PRINCIPLES.md         #   本风格补充规则
      DECISIONS.md          #   本风格决策
    _template/              # 新风格起点:复制它,改值即可
```
> 跨主题契约:`tokens.css` 的变量名固定不变,各主题只改“值”。这样同一份组件代码换主题即可换皮。

## 推荐引用方式

### 1. 作为 git submodule 引用

在每个要用标准的项目根目录:

```bash
git submodule add https://github.com/devin583/design-standard.git design-standard
git commit -m "chore: add design-standard submodule"
```

之后标准更新了,在项目里拉取最新:

```bash
git submodule update --remote design-standard
```

克隆一个已含子模块的项目时,记得带上子模块:

```bash
git clone --recurse-submodules <项目地址>
```

### 2. 在消费项目声明当前主题

在消费项目根目录的 `AGENTS.md` 中加入 `PROJECT_AGENTS.template.md` 里的片段,并写明:

```md
当前设计标准: `design-standard/`
当前主题: `themes/github`
```

应用代码需要显式引入当前主题的 token 文件。例如 Web 项目可以在全局 CSS 入口引入:

```css
@import "./design-standard/themes/github/tokens.css";
```

### 3. 可选:放进 Codex 全局配置

如果大多数项目都使用这套标准,可以把 `PROJECT_AGENTS.template.md` 的内容放进 `~/.codex/AGENTS.md`。项目仍应在根目录声明“当前主题”,因为主题是项目级选择。

## 迭代闭环

1. 你提一条视觉意见 / 纠正。
2. Codex 按“反哺分流”判断范围:项目特例 -> 留项目;风格通用 -> 进 `themes/<主题>/`;全风格通用 -> 进 core。
3. 凡进了 `design-standard/` 的,提交并 push 该仓库;其它项目用 `git submodule update --remote design-standard` 同步。
4. 定期让 Codex 对照 `PRINCIPLES.core.md` 自检并报告偏离。

意见越提越少,标准越来越稳。
