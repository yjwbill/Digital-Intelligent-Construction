# 数智施工 Design Token 规范（Draft）

版本：0.1.0  
状态：待 UI 评审

## 标记规则

- 无 `candidate`：当前建议标准，可供新组件引用。
- `candidate` 或 `❓`：存在歧义，仅用于记录候选值，不建议新业务使用。
- UI 确认后，将保留值提升为正式 Token，其他疑问项删除或改为兼容别名。

## Token 分层

1. Foundation：原始颜色、字号、间距、圆角、阴影。
2. Semantic：主色、文字、背景、边框、反馈状态。
3. Component：Control、Card、Table、Modal、Drawer。
4. Business Status：经济预警、安全风险、审批流程、趋势。
5. Chart：颜色、坐标轴、网格、Tooltip、Legend、柱宽和线宽。
6. Theme：普通桌面、深色大屏；移动端和报告主题待补齐。

## 已确认规范

| 类别 | 标准值 | 说明 |
|---|---|---|
| 平台主色 | `#165DFF` | 所有主色入口统一引用 `--dsc-color-primary` |
| Table 表头高度 | 单行 `44px`；双行或多行 `40px` | 多级表头每一层保持40px |
| Table 数据行高 | `40px` | 所有业务表格数据行统一使用40px，暂不保留48px/52px候选 |
| Card 圆角 | 普通 Card `8px`；强调容器/Modal `12px` | 16px及以上归并为12px；10px、6px归并为8px |
| Chart 数据折线 | `1px` | 普通折线与强调折线不再使用不同线宽 |
| Chart 辅助线/平均线 | `1px` | 实线、虚线均使用同一线宽 |
| Chart 柱宽 | 紧凑型 `18px`；标准型 `28px` | 小卡片/高密度图表使用18px，中大型图表使用28px |

## UI 待确认项 ❓

| 类别 | 待确认内容 | 当前候选 |
|---|---|---|
| 经济预警色 | 是否全面采用新版四级色 | 新版 `#FF0013/#FF9933/#FFF44F/#4596E2`；旧版保留候选 |
| 安全风险色 | 风险极高/较高/可控 | 暂用危险/警告/成功语义色 |
| 流程状态色 | 待办/办理中/完成/驳回 | 暂用橙/蓝/绿/红 |
| 字号 | 13、15、17、22px 是否全部归并 | 建议归并到 12/14/16/18/20/24px |
| 默认控件高度 | Input/Select/Button 默认高度 | 36px / 40px；历史值30px |
| Card Padding | 标准内容区内边距 | 16px / 20px / 24px |
| Modal 尺寸 | 固定尺寸或75vw×75vh | 480/640/800/1120px 或流式尺寸 |

Chart 线宽已确认：数据折线、辅助线和平均线均为 `1px`。坐标轴为 `1px`，网格线为 `0.5px`；该规则不包含数据点描边、雷达轮廓及图标线条。

## 引用示例

```css
.example-card {
  color: var(--dsc-color-text-primary);
  background: var(--dsc-card-bg);
  border: var(--dsc-card-border);
  padding: var(--dsc-space-4);
}
```

不要在新代码中引用 `--dsc-candidate-*`。候选值只用于评审和迁移对照。
