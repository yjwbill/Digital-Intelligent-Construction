# 住建委移动端 Demo 接入说明

- 来源：`ZJW-20260615-V2.10.0-FINAL (1).zip`
- 接入方式：独立静态子应用，通过主 Demo 的 iframe 容器加载。
- 入口：Demo 首页 → 住建委 → 移动端。
- 子应用入口：`src/products/zjw-mobile/index.html`

## 隔离原则

住建委与数智施工是两套独立产品：

1. 不加载数智施工 `styles.css`。
2. 不加载数智施工 `tokens.css`。
3. 保留住建委自身的 Vue、Element Plus、样式和业务代码。
4. 后续可以在本目录内建立住建委专属 Design Token，不与 `--dsc-*` Token 合并。
5. 主 Demo 只负责入口、容器和返回操作，不干预住建委内部页面布局。

## 注意事项

当前原包通过 unpkg CDN 加载 Vue 3 和 Element Plus，首次打开需要网络可访问；如需完全离线演示，应在后续版本中将依赖本地化。
