This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Content

Content负责存放文章以及对应的文章素材。它的结构如下：

```
blog/content/
├── README.md                    # 说明文档（不会被当作文章处理）
├── [类别]/
│   ├── meta.ts                  # 分类配置：type: 'category'
│   ├── index.mdx?               # 分类首页（可选）
│   ├── [系列]/
│   │   ├── meta.ts              # 系列配置：type: 'series', titleTemplate: '系列名 —— %s'
│   │   ├── index.mdx            # 系列首篇文章（不会在博客列表显示）
│   │   ├── 1.mdx                # 系列第1篇文章
│   │   ├── 2.mdx                # 系列第2篇文章
│   │   └── ...
│   └── [独立文章]/
│       └── index.mdx            # 独立文章
└── [独立文章]/
    └── index.mdx                # 根目录下的独立文章
```

## 目录类型说明

### 1. 分类目录 (Category)

- **识别方式**：存在 `meta.ts` 文件，且 `type: 'category'`
- **URL 影响**：会在 URL 中添加分类前缀，如 `ai` 分类的文章 URL 为 `/blog/ai/...`
- **index.mdx 处理**：
  - 如果存在 `index.mdx`，正常渲染为文章
  - 如果不存在 `index.mdx`，访问分类 URL 时重定向到 `/blog`

### 2. 系列目录 (Series)

- **识别方式**：存在 `meta.ts` 文件，且 `type: 'series'`
- **配置示例**：
  ```typescript
  const meta = {
    type: 'series',
    titleTemplate: '上下文工程 —— %s' // %s 会被替换为具体文章标题
  }
  ```
- **URL 规则**：系列名与文章名组合，如 `context-engineer-1`
- **文章处理**：
  - `index.mdx`：系列首篇文章，**不会在博客列表显示**，但可通过 URL 访问
  - `1.mdx`, `2.mdx` 等：系列子文章，**会在博客列表显示**

### 3. 文章目录 (Article)

- **识别方式**：不存在 `meta.ts` 文件，但存在 `index.mdx`
- **URL**：直接使用目录名，如 `web-gpu/game-of-life`
- **显示**：会在博客列表中显示

## 博客列表行为

博客列表 (`/blog`) 只显示以下内容：

- ✅ 独立文章（如 `web-gpu/game-of-life`）
- ✅ 系列下的子文章（如 `ai/context-engineer-1`）
- ❌ 系列的首篇文章（如 `ai/context-engineer`）
- ❌ README.md 文件

## URL 访问规则

所有文章都可以通过 URL 直接访问：

- `/blog/ai/context-engineer` - 系列首篇文章
- `/blog/ai/context-engineer-1` - 系列第1篇文章
- `/blog/web-gpu/game-of-life` - 独立文章

## 文件命名规则

- **README.md**：说明文档，不会被当作文章处理
- **index.mdx**：文章内容文件
- **meta.ts**：目录类型配置文件
- **其他 .mdx/.md 文件**：在系列目录下会被当作系列文章处理
