# Selection Primitives

原生 JavaScript 选择类基础组件，视觉与状态使用 `Design Token`，不依赖 React、Tailwind 或第三方运行时。

## Components

- `DscCheckbox.render(config)`：复选框，支持选中、半选、禁用和 `onChange`。
- `DscPopover.render(config)`：轻量浮层，支持对齐、视口防溢出、点击外部和 Escape 关闭。
- `DscCombobox.render(config)`：可搜索单选，支持方向键、回车选择和 Escape 关闭。
- `DscMultiSelect.render(config)`：可搜索多选，支持标签回显、删除、清空、全选/半选和键盘选择。

## Example

```js
DscMultiSelect.render({
  id: "budgetYears",
  options: ["2025", "2026", "2027"],
  values: ["2026"],
  placeholder: "请选择全面预算年度",
  onChange: values => console.log(values)
});
```

使用 `DscCheckbox.getValue(id)`、`DscCombobox.getValue(id)` 或 `DscMultiSelect.getValue(id)` 读取当前值。

## Visual specification

- 基础高度：`32px`（多选标签换行时允许按内容增高）
- 边框：`#E5E6EB`
- 圆角：`4px`
- 水平内边距：`10px`
- 字号：`14px`
- 主色：`#165DFF`
- 组件库示例宽度：`320px`
