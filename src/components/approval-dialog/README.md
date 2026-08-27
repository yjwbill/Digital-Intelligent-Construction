# ApprovalDialog

标准审批弹框组件，分为“流程发起前”和“流程处理过程”两种模式。

## 基础用法

### 流程发起前

```js
ApprovalDialog.open({
  title: "停工申请",
  mode: "initiation",
  content: "<section>申请表单</section>",
  previewNodes: ["发起审批", "项目部总工", "分公司管理员", "结束审批"]
});
```

### 流程处理过程

```js
ApprovalDialog.open({
  title: "实际产值上报详情",
  content: "<section>业务详情</section>",
  status: "审批中",
  viewRecords: [
    { person: "王安全", time: "2026-07-24 15:18" },
    { person: "王安全", time: "2026-07-24 10:06" }
  ],
  records: [
    {
      node: "发起审批",
      status: "done",
      time: "2026-08-27 09:18",
      person: "王安全",
      org: "轨交分公司",
      action: "提交审批",
      opinion: "同意提交",
      receiver: "分公司工程部副经理"
    }
  ]
});
```

## API

- `open(options)`：打开完整审批弹框。
- `renderLayout(options)`：渲染业务内容与审批记录的双栏布局。
- `renderPanel(options)`：渲染审批记录/浏览记录双 Tab 面板，适合接入已有业务弹框。
- `renderPreviewPanel(options)`：渲染发起前的流程节点预览面板。
- `switchTab(button, name)`：切换审批记录和浏览记录。
- `togglePanel(button)`：切换审批记录面板的展开状态。

`status` 支持未发起、审批中、审批通过和已驳回；节点 `status` 支持 `wait`、`processing`、`done` 和 `reject`。

`mode` 使用 `initiation` 时展示流程预览；省略或使用 `process` 时展示审批记录/浏览记录。

`viewRecords` 每项支持 `person`、`time` 和可选的 `avatar`。组件按浏览时间从新到旧排序并按日期归类，同一人员多次浏览会保留为多条记录。未传入时展示临时示例数据。
