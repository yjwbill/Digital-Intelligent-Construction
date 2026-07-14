# 数智施工演示环境

这是一个用于产品演示的静态前端 Demo，已整理为适合 GitHub Pages 发布的目录结构。

## 在线发布

将本目录中的所有文件上传到 GitHub 仓库根目录，然后开启 GitHub Pages：

1. 进入仓库 `Settings`。
2. 打开 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，Folder 选择 `/root`。
5. 保存后等待 GitHub 生成访问地址。

访问地址通常为：

```text
https://你的用户名.github.io/仓库名/
```

## 目录结构

```text
.
├── index.html              # 页面入口
├── app.js                  # 页面逻辑与模拟数据
├── styles.css              # 全局样式
├── organization-data.js    # 组织基础数据
├── src/                    # 图片、图标、组件资源
├── data/                   # 演示数据与数据结构占位
├── docs/                   # 文档资料
├── CHANGELOG.txt           # 历史版本说明
└── .nojekyll               # GitHub Pages 静态资源开关
```

## 本地预览

可以直接使用任意静态服务器预览，例如：

```bash
npx serve .
```

或使用 VS Code 的 Live Server 插件打开 `index.html`。

## 注意事项

- GitHub Pages 只能托管静态文件，不能运行后端服务。
- 当前在线版本适合页面演示、交互预览和同事评审。
- 数据字典、组织、人员等在线维护后的服务端持久化，需要后续接入后端接口或使用本地服务版本。

## 当前版本

`EM-20260701-V2.2.274-OUTPUT-COMPLETION-RATE`

本版本基于同事协作调整后的产值模块继续开发，将企业管理生产产值看板中的“产值进度”和相关“完成率”指标统一命名为“产值完成率”。

本版本同步施工日志详情字段：文件上报日志在项目端详情和企业端下钻详情中，基础信息均仅显示工区和日期。

本版本优化施工日志上报字段：文件上报基础信息仅保留工区和日期；在线上报温度输入框增加 `℃` 单位。

本版本建立项目管理统一项目上下文。右上角项目切换读取项目主数据，切换后同步刷新项目总览、项目详情、工程总体筹划和施工日志；企业管理继续以项目明细为基础进行汇总。

本版本统一施工日志示例数据：企业端与项目端共用 38 个项目在 2026 年 6 月 18 日至 7 月 13 日的上报状态和日志记录；更早日期及 7 月 13 日之后显示为未开始。

## Local Master Data

This version adds local maintenance for organizations, users, projects, labor workers, and data dictionaries.
Data is saved in browser localStorage and persists after refresh. Use `Base > Organization Management` to export, import, or restore the complete master-data package.

See `docs/master-data-guide.md` and `data/master-data-schema.json` for the data model and backend handoff reference.
