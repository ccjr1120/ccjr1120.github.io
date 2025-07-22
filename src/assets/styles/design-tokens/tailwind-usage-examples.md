# Tailwind CSS 语义化Token使用示例

## 🎨 颜色类

### 主色系
```jsx
{/* 主色背景 */}
<button className="bg-primary text-white">默认按钮</button>
<button className="bg-primary-hover text-white">悬停状态</button>
<button className="bg-primary-active text-white">激活状态</button>

{/* 文字颜色 - 优化后的命名 */}
<h1 className="text-content">主要文字内容</h1>
<p className="text-muted">次要文字/描述</p>
<span className="text-disabled">禁用状态文字</span>
```

## ✍️ 字体类

### 语义化字体大小
```jsx
{/* 字体大小 */}
<p className="text-body">正文内容</p>
<small className="text-description">描述文字</small>
<h1 className="text-heading-large">大标题</h1>
<h2 className="text-heading-small">小标题</h2>

{/* 行高 */}
<p className="leading-body">正文行高</p>
<p className="leading-description">描述行高</p>
<h1 className="leading-heading-large">大标题行高</h1>
<h2 className="leading-heading-small">小标题行高</h2>

{/* 字重 */}
<p className="font-body">正文字重</p>
<small className="font-description">描述字重</small>
<h1 className="font-heading-large">大标题字重</h1>
<h2 className="font-heading-small">小标题字重</h2>
```

## 🔄 圆角类

### 容器圆角
```jsx
{/* 不同容器的圆角 */}
<button className="rounded-button">按钮圆角</button>
<div className="rounded-card">卡片圆角</div>
<div className="rounded-modal">模态框圆角</div>
<div className="rounded-dropdown">下拉菜单圆角</div>
<div className="rounded-tooltip">工具提示圆角</div>
<input className="rounded-input" />
<div className="rounded-floating">浮动容器圆角</div>
```

## 🌫️ 阴影类

### 容器阴影
```jsx
{/* 不同容器的阴影 */}
<button className="shadow-button">按钮阴影</button>
<button className="shadow-button-hover">按钮悬停阴影</button>
<div className="shadow-card">卡片阴影</div>
<div className="shadow-card-hover">卡片悬停阴影</div>
<div className="shadow-modal">模态框阴影</div>
<div className="shadow-dropdown">下拉菜单阴影</div>
<div className="shadow-tooltip">工具提示阴影</div>
<input className="shadow-input" />
<input className="shadow-input-focus" />
<div className="shadow-floating">浮动容器阴影</div>
```

## 📚 层级类

### 容器层级
```jsx
{/* 不同容器的z-index */}
<button className="z-button">按钮层级</button>
<div className="z-card">卡片层级</div>
<div className="z-modal">模态框层级</div>
<div className="z-dropdown">下拉菜单层级</div>
<div className="z-tooltip">工具提示层级</div>
<input className="z-input" />
<div className="z-floating">浮动容器层级</div>
```

## 🎯 组合使用示例

### 完整的按钮组件
```jsx
<button className="
  bg-primary hover:bg-primary-hover active:bg-primary-active
  text-white text-body font-body leading-body
  rounded-button shadow-button hover:shadow-button-hover
  z-button
  px-4 py-2 transition-all duration-200
">
  语义化按钮
</button>
```

### 完整的卡片组件
```jsx
<div className="
  bg-white
  rounded-card shadow-card hover:shadow-card-hover
  z-card
  p-6 transition-shadow duration-200
">
  <h2 className="text-heading-small font-heading-small leading-heading-small text-content mb-2">
    卡片标题
  </h2>
  <p className="text-body font-body leading-body text-muted">
    卡片描述内容
  </p>
</div>
```

### 完整的输入框组件
```jsx
<input 
  className="
    w-full
    rounded-input shadow-input focus:shadow-input-focus
    text-body font-body leading-body text-content
    border border-gray-300 focus:border-primary
    z-input
    px-3 py-2 transition-all duration-200
  "
  placeholder="请输入内容"
/>
```

## 📖 语义化命名说明

### 文字颜色优化
- `text-content` - 主要内容文字（之前的 text-primary）
- `text-muted` - 次要/描述文字（之前的 text-secondary）  
- `text-disabled` - 禁用状态文字

这样的命名更加：
- **简洁**: 避免了 `text-text-*` 的冗余
- **语义化**: `content`、`muted`、`disabled` 更直观
- **通用**: 符合业界常用的设计系统命名规范 