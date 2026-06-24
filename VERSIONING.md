# VERSIONING.md — 标准的版本与更新治理

> 目的:多个项目通过 submodule 引用本标准时,避免“标准一更新就把某个项目打坏”。现在保持轻量;等真有多个项目频繁消费且改动频繁时,再考虑加完整 CHANGELOG / MIGRATION。

## 关键事实:submodule 锁定 commit

消费项目的 submodule 指向一个具体 commit。所以本标准仓库再怎么更新,消费项目在显式执行 `git submodule update --remote design-standard` 之前不会有任何变化。

也就是说:更新是拉取式的,主动权在消费项目手里,不存在被动被打坏。

## 什么算 breaking

以下改动可能要求消费项目改代码:

- 删除一个 token 变量。
- 重命名一个 token 变量。
- 改变 token 变量语义,导致旧用法明显不再成立。
- 审计规则收紧到默认失败,且无法通过 baseline 渐进治理吸收。

跨主题契约:不要随意删改 token 变量名。变量名是消费项目代码引用的接口。要弃用某个 token,先保留并标注 deprecated,过渡期后再删,且删除 commit 必须标为 breaking。

## 什么通常不是 breaking

- 新增 token、新增主题。
- 新增 component / pattern / interaction 规范。
- 新增脚本或文档。
- token 值微调,且变量名和语义不变。
- 文档措辞、注释、示例修正。

## 消费项目更新检查清单

执行 `git submodule update --remote design-standard` 前后:

1. 先看本仓库这次更新是否含 `breaking:` commit 或涉及 token 变量删改。
2. 更新后跑审计:`node design-standard/scripts/audit-all.mjs`。
3. 跑构建 / 启动。
4. 看关键页面截图或手动确认主要流程没有被改坏。
5. 没问题再提交消费项目里的 submodule 指针更新。

## 提交前缀

本标准仓库 commit 建议用前缀标明影响面:

- `feat:` 新增能力,通常是 minor。
- `fix:` 修正问题,通常是 patch。
- `docs:` 文档和说明。
- `breaking:` 破坏性变更,消费项目更新前必须检查。
