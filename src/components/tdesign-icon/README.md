# TDesign Icon

The platform icon standard uses the local TDesign SVG asset library.

## Rules

- Use `renderTDesignIcon(name, options)` in JavaScript templates.
- Use `.td-icon` with a common alias class for static HTML loaded before application scripts.
- Reuse icons from `src/assets/tdesign-icons`; do not draw operation icons manually.
- Use `chevron-down` for selects and dropdowns, and rotate the same icon for open state.
- Use `close` for dialog and removable-item actions.
- Business charts and data-driven SVG graphics are not operation icons and may remain custom.
- Icon-only buttons require an accessible label and tooltip.

```js
renderTDesignIcon("search",{size:16,label:"搜索"});
renderTDesignIcon("close",{size:18,label:"关闭"});
```

Source: `tdesign-icons-svg@0.4.6`, MIT License.
