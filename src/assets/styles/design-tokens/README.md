# Design Tokens

基于 `hero-theme.json` 主题配置转换而来的CSS变量系统。

## 颜色系统

### 主题支持
- **亮色主题** (默认)
- **暗色主题** (通过 `prefers-color-scheme: dark` 自动切换)

### 颜色规模
每种颜色都有完整的 50-900 色阶：

#### 主要颜色
- `default` - 中性灰色
- `primary` - 主色 (紫色)
- `secondary` - 辅助色 (蓝紫色)
- `success` - 成功色 (绿色)
- `warning` - 警告色 (橙色)
- `danger` - 危险色 (红色)

#### 基础颜色
- `background` - 页面背景色
- `foreground` - 主要文字色
- `content1-4` - 内容区域背景色 (渐进层级)
- `focus` - 焦点色
- `overlay` - 遮罩色

## 在 TailwindCSS 中使用

### 背景色
```html
<!-- 主色系 -->
<div class="bg-primary">主色背景</div>
<div class="bg-primary-500">主色 500</div>

<!-- 其他颜色 -->
<div class="bg-secondary-200">辅助色 200</div>
<div class="bg-success-600">成功色 600</div>
<div class="bg-warning-400">警告色 400</div>
<div class="bg-danger-700">危险色 700</div>
```

### 文字颜色
```html
<p class="text-primary">主色文字</p>
<p class="text-foreground">默认文字色</p>
<p class="text-secondary-600">辅助色文字</p>
```

### 边框颜色
```html
<div class="border border-primary">主色边框</div>
<div class="border border-default-300">默认边框</div>
```

## CSS 变量直接使用

你也可以在CSS中直接使用这些变量：

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border: 1px solid var(--color-primary-300);
}
```

## 暗色主题

所有颜色在暗色主题下会自动切换到相应的暗色版本，无需额外配置。 