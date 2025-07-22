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

### 背景色系 - 黑色主题
```jsx
{/* 页面和容器背景 */}
<div className="bg-bg-page">页面主背景</div>
<div className="bg-bg-card">卡片背景</div>
<div className="bg-bg-surface">表面背景</div>
<div className="bg-bg-elevated">悬浮/突出背景</div>
```

### 边框色系
```jsx
{/* 边框颜色 */}
<div className="border border-border-subtle">细边框</div>
<div className="border border-border-default">默认边框</div>
<div className="border border-border-strong">强调边框</div>
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

### 完整的页面布局（黑色主题）
```jsx
<div className="bg-bg-page min-h-screen">
  {/* 页面主背景 */}
  <header className="bg-bg-card border-b border-border-subtle p-4">
    <h1 className="text-heading-large font-heading-large text-content">
      页面标题
    </h1>
  </header>
  
  <main className="p-6">
    {/* 主要内容区域 */}
  </main>
</div>
```

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

### 完整的卡片组件（黑色主题）
```jsx
<div className="
  bg-bg-card border border-border-subtle
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

### 完整的输入框组件（黑色主题）
```jsx
<input 
  className="
    w-full
    bg-bg-surface border border-border-default focus:border-primary
    rounded-input shadow-input focus:shadow-input-focus
    text-body font-body leading-body text-content
    z-input
    px-3 py-2 transition-all duration-200
    placeholder:text-muted
  "
  placeholder="请输入内容"
/>
```

### 模态框组件（黑色主题）
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center">
  <div className="
    bg-bg-card border border-border-default
    rounded-modal shadow-modal
    max-w-md w-full mx-4 p-6
  ">
    <h3 className="text-heading-small font-heading-small text-content mb-4">
      模态框标题
    </h3>
    <p className="text-body text-muted mb-6">
      模态框内容描述
    </p>
    <div className="flex gap-3 justify-end">
      <button className="
        bg-bg-surface hover:bg-bg-elevated
        text-content border border-border-default
        rounded-button px-4 py-2
      ">
        取消
      </button>
      <button className="
        bg-primary hover:bg-primary-hover
        text-white rounded-button px-4 py-2
      ">
        确认
      </button>
    </div>
  </div>
</div>
```

## 🌙 黑色主题设计层级

### 背景色层级（从深到浅）
1. `bg-bg-page` - 页面主背景（最深）
2. `bg-bg-card` - 卡片容器背景  
3. `bg-bg-surface` - 表面元素背景
4. `bg-bg-elevated` - 悬浮/突出背景（最浅）

### 边框色层级
1. `border-border-subtle` - 细分割线（最浅）
2. `border-border-default` - 默认边框
3. `border-border-strong` - 强调边框（最深）

### 文字颜色搭配
- 在深色背景上使用浅色文字：`text-content`（白色/浅色）
- 次要信息使用：`text-muted`（中等灰色）
- 禁用状态使用：`text-disabled`（深灰色）

## 📖 语义化命名说明

### 背景色优化
- `bg-bg-page` - 页面级背景
- `bg-bg-card` - 卡片级背景  
- `bg-bg-surface` - 表面级背景
- `bg-bg-elevated` - 悬浮级背景

### 边框色优化
- `border-border-subtle` - 细微边框
- `border-border-default` - 默认边框
- `border-border-strong` - 强调边框

这样的命名更加：
- **分层明确**: 背景色有清晰的深浅层级
- **语义化**: 名称直观表达用途
- **主题友好**: 适配黑色/深色主题设计 