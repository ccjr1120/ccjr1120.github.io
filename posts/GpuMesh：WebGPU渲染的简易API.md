---
date: 9/21/2024, 12:56:25 AM
slug: f491aa71bbbe44b78e051a1170f529fe
desc: 记录一下开发GPUMesh的过程。
---

起源是想使用WebGPU仿照PIXI实现一个2D图形库，然后今天看到了西瓜哥的一篇新文章[《用Pixi.js写WebGL》](https://mp.weixin.qq.com/s/jfk7dOiQSVT6TzrdN2hjqg),于是就想着自己虽然要实现一个图形库，但是没有一点WebGPU的知识。于是便打算用WebGPU实现一个类似于文章中的api，帮自己熟悉一些基础知识。
前两步都是记录一下工程转换及打包的经验，后面是WebGPU的正文。

## Step 1:Monorepo

没有打算为gpu-mesh单独开一个库，那就要把本项目改造成monorepo项目了。但是在改造过程中确遇到了几个问题：

- next.js没办法找到tsconfig.json，导致无法编译。在next.config.mjs中指定了tsconfig.json的路径
  ```json
  {
    "typescript": {
      "tsconfigPath": "./tsconfig.json"
    }
  }
  ```
- eslint推荐并且也只支持在根目录下有一个配置文件，这导致gpu-mesh库会不符合next的eslint规则。为相关文件指定files来解决
  ```bash
  {
    ...compat.extends('next/core-web-vitals')[0],
    files: ['packages/io/**/*'],
    settings: {
      next: {
        rootDir: 'packages/io/'
      }
  }
  ```
- 并非所有bun的命令都支持--filter指定包名，只能cd到具体包目录下执行命令。比如：bun add

## Step 2: 打包并且在package/io中引用

关于打包其实花了很长时间，但是处理之后其实也都很简单。

- 在package.json中指定的是源码入口，而非打包后的入口。导致无法直接引用。
- ts默认不会被打包，要使用tsc来进行打包
- 源码中的.d.ts不会被ts进行打包，要手动移动到dist存放类型的目录下

## Step 3: 使用GPU绘制一个三角形——了解GPU基础知识

## Step 4: 使用WebGPU构建Conway的《Game of Life》——了解进阶知识，封装渲染流程

## Step 5: 使用GpuMesh构建一个烟花效果——完善GpuMesh调用过程
