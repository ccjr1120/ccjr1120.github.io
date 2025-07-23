# 📝 Articles 系统使用指南

## 🚀 快速开始

### 创建新文章

使用便捷的脚本命令来创建新文章：

```bash
npm run create-article "article-slug" "文章标题" "标签1,标签2,标签3"
```

**示例:**

```bash
npm run create-article "react-hooks" "React Hooks 深度解析" "React,JavaScript,前端"
npm run create-article "typescript-tips" "TypeScript 实用技巧" "TypeScript,编程"
```

### 文章目录结构

```
src/app/articles/
├── game-of-life/
│   ├── article.json      # 文章元数据
│   └── component.tsx     # 文章内容组件
├── react-hooks/
│   ├── article.json
│   └── component.tsx
└── your-new-article/
    ├── article.json
    └── component.tsx
```

## 📄 文章格式

### 文章元数据 (article.json)

```json
{
  "title": "文章标题",
  "excerpt": "文章摘要描述...",
  "date": "2023-12-15",
  "author": "匆匆孑然",
  "tags": ["标签1", "标签2", "标签3"],
  "slug": "article-slug"
}
```

### 文章内容组件 (component.tsx)

```tsx
export default function YourArticleComponent() {
  return (
    <div className="prose prose-lg mx-auto max-w-4xl">
      <h1>文章标题</h1>
      
      <h2>前言</h2>
      <p>你的文章内容...</p>
      
      <h2>代码示例</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`function example() {
  console.log('Hello World!');
}`}</code>
      </pre>
      
      <h2>总结</h2>
      <p>总结内容...</p>
    </div>
  );
}
```

## 🎨 样式指南

### 基础样式

文章组件使用Tailwind CSS的prose类来提供基础的排版样式：

```tsx
<div className="prose prose-lg mx-auto max-w-4xl">
  {/* 文章内容 */}
</div>
```

### 代码块

```tsx
<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
  <code>{`你的代码内容`}</code>
</pre>
```

### 引用

```tsx
<blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
  引用内容
</blockquote>
```

### 提示框

```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  <p className="text-blue-800 mb-0">💡 提示：这里是提示内容</p>
</div>
```

## 🛠️ 技术实现

### 服务器端组件

```tsx
import { getAllArticles } from '@/lib/articles'

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  )
}
```

### 动态路由

文章通过 `src/app/articles/[slug]/page.tsx` 动态路由显示，组件会自动加载对应的文章组件。

## 🔧 可用功能

### 服务器端函数

```typescript
import {
  getAllArticles,       // 获取所有文章
  getArticleById,       // 根据ID获取文章
  getArticleBySlug,     // 根据slug获取文章
  getArticlesByTag,     // 按标签筛选
  getLatestArticles,    // 获取最新N篇
  searchArticles,       // 搜索文章
  getAllTags,           // 获取所有标签
  getArticleContent     // 获取文章内容
} from '@/lib/articles'
```

## 🎯 优势

### 相比MDX的优势

1. **更好的IDE支持**：完整的TypeScript支持和代码提示
2. **组件复用**：可以在文章中使用自定义React组件
3. **更灵活的样式**：完全控制样式和布局
4. **更好的性能**：编译时组件优化
5. **调试友好**：标准React组件调试体验

### 开发体验

1. **类型安全**：完整的TypeScript支持
2. **热重载**：修改组件立即看到效果
3. **组件化**：可以抽取通用组件
4. **自定义交互**：支持复杂的交互逻辑

## 📁 文件结构说明

```
src/
├── lib/articles.ts           # 服务器端文章处理逻辑
├── app/
│   ├── articles/             # 文章目录
│   │   ├── [slug]/
│   │   │   └── page.tsx      # 动态路由页面
│   │   ├── game-of-life/     # 示例文章
│   │   │   ├── article.json
│   │   │   └── component.tsx
│   │   └── README.md         # 本文档
│   └── page.tsx              # 首页 (文章列表)
└── scripts/
    └── create-article.mjs    # 文章创建脚本
```

## 🚨 注意事项

1. **文件命名**：
   - 数据文件必须命名为 `article.json`
   - 组件文件必须命名为 `component.tsx`
   - 目录名即为文章slug

2. **slug格式**：只能包含小写字母、数字和连字符

3. **组件导出**：组件必须使用默认导出

4. **样式一致性**：建议使用提供的样式类保持一致性

## 🔄 迁移指南

### 从MDX迁移

1. 将 `.mdx` 文件内容复制到新的 `component.tsx` 中
2. 将frontmatter内容复制到 `article.json` 中
3. 调整JSX语法（转义字符等）
4. 测试组件正常工作 