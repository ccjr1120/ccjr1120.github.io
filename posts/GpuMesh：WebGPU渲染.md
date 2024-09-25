---
date: 9/21/2024, 12:56:25 AM
slug: f491aa71bbbe44b78e051a1170f529fe
desc: 记录一下开发GPUMesh的过程。
---

起源是想使用WebGPU仿照PIXI实现一个2D图形库，然后今天看到了西瓜哥的一篇新文章[《用Pixi.js写WebGL》](https://mp.weixin.qq.com/s/jfk7dOiQSVT6TzrdN2hjqg),于是便打算用WebGPU实现一个类似于文章中的api，帮自己熟悉一些基础知识。
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

## Step 3: 使用WebGPU构建Conway的《Game of Life》——了解基本知识，封装渲染流程

本来是[WebGPU 入门：绘制一个三角形](https://juejin.cn/post/7284645764788420644?searchId=202409152316220CB1D718493017E3ED60)打算通过这篇文章来学习一下的，但是后面看到google官方出的一篇文章[您的第一个WebGPU应用
](https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#0)，更成体系，更全面。这里所做的基本上就是把这篇文章再叙述一遍。

### 什么是WebGPU

在GPU之前有一个叫GL的图形接口，都是对GPU原生交互的一层封装。只不过GL采用的是07年的OpenGL ES 2.0 API，而GPU则是把这些年来发展的更现代的API接口带到web端上。

### 初始化WebGPU

WebGPU通过一个新的API去获取：`navigator.gpu`。一般用它是否存在来确定浏览器是否支持WebGPU。如果真正的要使用WebGPU，还需要创建下面两个对象：

```ts
const adapter = await navigator.gpu.requestAdapter()
if (!adapter) {
  throw new Error('No appropriate GPUAdapter found.')
}
const device = await adapter.requestDevice()
```

`navigator.gpu.requestAdapter()`的作用是浏览器从你的多个GPU设备中选择一个合适的适配器，它也支持将一些填入一些参数，从而更加有目的的使用合适的GPU。如果找不到支持的GPU，它会返回null。

`adapter.requestDevice()`会返回一个device对象，它是与GPU进行大部分交互的主接口。负责发起命令，创建资源，管理内存等。同时它也支持传入参数用于更高级的用途。

众所周知，渲染离不开画布，使用WebGPU需要对画布多进行一步设置。

```ts
const context = canvas.getContext('webgpu')
const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
context.configure({
  device: device,
  format: canvasFormat
})
```

format是渲染所使用的纹理格式。纹理是WebGPU用来存储图片数据的对象，每种纹理都有相应的格式，可以告诉GPU这些数据在内存中的布局方式。以后可能会学到纹理内存的工作原理。重要的是，画布上下文会提供代码绘制到的纹理，而您使用的格式会影响画布显示这些图片的效率。使用不同的纹理格式时，不同类型的设备效果最佳，而且如果不使用设备的首选格式，这可能会导致系统在后台进行额外的内存复制，从而将图片显示为页面的一部分。  
到这里，使用WebGPU所需要的对象已经创建完成了，接下来是如何使用WebGPU进行渲染。

### 使用WebGPU进行渲染

WebGPU的渲染，就类似于创建一条流水线一样。在一开始，使用`encoder`创建一个构建流水线的构造区-》调用`beginRenderPass`声明起始点-》调用`renderPass.end()`声明流水线结束-》调用` encoder.finish()`声明流水线构造完成-》调用`device.queue.submit`开始执行。整体流程如下：

```ts
const encoder = device.createCommandEncoder()
const renderPass = encoder.beginRenderPass({
  colorAttachments: [
    {
      // 从画布上下文中获取纹理，该纹理返回一个像素宽度和高度与画布的width和height属性以及您调用context.configure()时指定的format匹配的纹理。
      view: context.getCurrentTexture().createView(),
      // loadOp值为"clear"表示您希望在渲染通道开始时清除纹理。
      loadOp: 'clear',
      // storeOp值为"store"表示渲染通道完成后，您希望将渲染通道期间完成的任何绘制的结果保存到纹理中。
      storeOp: 'store'
    }
  ]
})
renderPass.end()
const commandBuffer = encoder.finish()
device.queue.submit([commandBuffer])
```

这里阐述了WebGPU的渲染流程，但是在流水线中间没有添加任何过程，只声明了开始与结束，这将在后面讲到。但是在这之前，鉴于前文中多次提到了纹理，先给自己普及一下什么是纹理？

#### 什么是纹理

```bash
纹理通常是2d图像的形式呈现，一个2d图像就是一个二维的颜色数组，
所以思考下：为什么要使用二维数组形式的纹理？
其实我们可以使用存储缓冲区保存二维数组。
纹理的特殊之处在于可以使用一种叫做采样器的特殊硬件进行访问，
采样器可以在一张纹理中读取多达16个不同的值，并以一种通用的方式进行混合。
```

通过上文可以简单理解为纹理就是存储更多信息的二维数组，可以让GPU使用采样器进行更高效的处理。也只能这么简单了，什么采样器，什么二维数组，还有更多的知识以后再学吧。

### 补充渲染流程，渲染一个正方形

又是一些基础知识，首先：GPU只能处理点、线、三角形这三种基本形状，它们也被叫做图元。如果我们要显示一个正方形，其实就是拼接两个三角形。关于其它的知识可能还有很多，比如坐标系、typeArray、着色器等，但在这里就不展开来说了。

#### 顶点

首先就是按照我们所说的，准备两个三角形的顶点

```js
const vertices = new Float32Array([
  //   X,    Y,
  // Triangle 1
  -0.8, -0.8, 0.8, -0.8, 0.8, 0.8,
  // Triangle 2
  -0.8, -0.8, 0.8, 0.8, -0.8, 0.8
])
```

我们使用了js创建了两个三角形的顶点坐标，但是GPU是无法使用js数组中的数据绘制顶点。GPU拥有自己针对渲染进行高度优化的内存，是通过GPUBuffer对象进行管理的。缓冲区是GPU可以轻松访问并标记用于某些目的的内存块。您可以将其想象为有点像 GPU的TypedArray。接下来我们就创建对应顶点数据的缓冲区。

```js
const vertexBuffer = device.createBuffer({
  // 名称，可报错时回溯时使用
  label: 'Cell vertices',
  size: vertices.byteLength,
  // 缓冲区的用途，下面的意思是用于顶点数据并且可复制数据到本缓冲区
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
})
```

当缓冲区最初创建时，它包含的内存将被初始化为零。有多种方法可以更改其内容，但最简单的方法是使用要复制的 TypedArray 调用device.queue.writeBuffer()。

```js
device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices)
```

现在您有了一个包含顶点数据的缓冲区，但就 GPU 而言，它只是一个字节块。如果你想用它画任何东西，你需要提供更多的信息。您需要能够告诉 WebGPU 有关顶点数据结构的更多信息。

```js
const vertexBufferLayout = {
  // 每个顶点的字节大小 float32x2 = 8 bytes
  arrayStride: 8,
  attributes: [
    {
      format: 'float32x2',
      offset: 0,
      shaderLocation: 0 // Position, see vertex shader
    }
  ]
}
```

#### 着色器

```bash
着色器是什么东西呢？
着色器是您编写并在 GPU 上执行的小程序。
每个着色器在数据的不同阶段上运行：顶点处理、片段处理或一般计算。
因为它们位于 GPU 上，所以它们的结构比普通 JavaScript 更严格。
但这种结构使它们能够非常快速地执行，而且最重要的是，可以并行执行！
WebGPU 中的着色器是用称为WGSL （WebGPU 着色语言）的着色语言编写的。
从语法上讲，WGSL 有点像 Rust，其功能旨在使常见类型的 GPU 工作（如向量和矩阵数学）更容易、更快。
```

着色器分为顶端着色器与片段着色器，顶点着色器会为每个顶点执行一次，拿正方形举例，一共有六个顶点，所以顶点着色器会执行六次。每次调用它时，vertexBuffer中的不同位置都会作为参数传递给函数，而顶点着色器函数的工作就是返回绘制时的相应位置。需要注意的是，顶点着色器并不一定按顺序调用，它们往往是并行执行的，所以顶点着色器之间不能进行通信

WGSL通过`@vertex`注解来表示顶点着色器。其中pos代表的是我们输入的顶点，`@location(0)`是我们在`vertexBufferLayout`给它做的标识。vec2f是WGSL数据的类型，代表两个浮点数。`@builtin(position) vec4f`代表返回值类型

```js
@vertex
fn vertexMain(@location(0) pos: vec2f) ->
  @builtin(position) vec4f {
  return vec4f(pos, 0, 1);
}
```

同样的还有`@fragment`来表示片段着色器,片段着色器与顶点着色器基本上相似，但是它是在为每一个像素执行，还有就是这里返回的Vec4f代表着颜色。

```js
@fragment
fn fragmentMain() -> @location(0) vec4f {
  return vec4f(1, 0, 0, 1); // (Red, Green, Blue, Alpha)
}
```

GPU中渲染的每一个物体由顶点数据+着色器来完成的，准备好这些之后，我们只需要调用GPU的接口将其传递给GPU即可。

```js
const cellPipeline = device.createRenderPipeline({
  label: 'Cell pipeline',
  layout: 'auto',
  vertex: {
    module: cellShaderModule,
    entryPoint: 'vertexMain',
    buffers: [vertexBufferLayout]
  },
  fragment: {
    module: cellShaderModule,
    entryPoint: 'fragmentMain',
    targets: [
      {
        format: canvasFormat
      }
    ]
  }
})
renderPass.setPipeline(cellPipeline)
renderPass.setVertexBuffer(0, vertexBuffer)
renderPass.draw(vertices.length / 2) // 6 vertices
```

在上文中，我们讲了流水线的开始与结束，但是没有往中间插入过程。`createRenderPipeline`就是往流水线中间增加环节。跟着[您的第一个WebGPU应用
](https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#0)走，后面还会逐步讲到在着色器里计算、使用结构体、了解存储缓冲区。但是目前而言，我已经了解到了GPU基本的工作流程，后面只不过在流程中添加详情，我就不打算再一步步翻译那篇文章了。后面一个章节我将只会使用GpuMesh来完成那篇文章最后的成果。

## Conway's Game of Life

```ts
// app.tsx
Gpu.Mesh.loadDevice().then(() => {
  new Gpu.Mesh(containerRef.current!, {
    vertices: new Float32Array([
      //   X,    Y,
      -0.8,
      -0.8, // Triangle 1 (Blue)
      0.8,
      -0.8,
      0.8,
      0.8,

      -0.8,
      -0.8, // Triangle 2 (Red)
      0.8,
      0.8,
      -0.8,
      0.8
    ]),
    instanceCount: GRID_SIZE ** 2,
    attributes: {
      gridUniform: new Float32Array([GRID_SIZE, GRID_SIZE]),
      cellStateStorage: cellStateStorage
    },
    shader: {
      vertex: `
        struct VertexInput {
          @location(0) pos: vec2f,
          @builtin(instance_index) instance: u32,
        };

        struct VertexOutput {
          @builtin(position) pos: vec4f,
          @location(0) cell: vec2f
        };
        
        @group(0) @binding(0) var<uniform> grid: vec2f;
        @group(0) @binding(1) var<storage> cellState: array<u32>;
        
        @vertex
        fn vertexMain(input: VertexInput) ->
          VertexOutput {
          let pos = input.pos;
          let instance = input.instance;
          let i = f32(instance);
          let cell = vec2f(i % grid.x, floor(i / grid.x));
          let state = f32(cellState[instance]);
          let cellOffset = cell / grid * 2;
          let gridPos = (pos*state+1) / grid - 1 + cellOffset;
          var output: VertexOutput;
          output.pos = vec4f(gridPos, 0, 1);
          output.cell = cell;
          return output;
        }`,
      fragment: `
        @fragment
        fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
          let cell = input.cell;
          let c = cell / grid;
          return vec4f(c,1-c.x,1);
        }`
    }
  })
})
```

GPUMesh接受顶点数据、顶点着色器、片段着色器就可以完成一次渲染。如果想传入uniform，只需要在attributes中以uniform结尾即可，同时也支持类似的storage。在后面可能还会支持绑定更多的Group，但是目前只做这些了。

最后总结一下，WebGPU完成渲染需要：

- 创建device
  ```ts
  const adapter = await navigator.gpu.requestAdapter()
  if (adapter === null) throw new Error('un supported webgpu')
  this.device = await adapter.requestDevice()
  ```
- 指定使用的纹理格式
  ```ts
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
  ctx.configure({
    device: this.device,
    format: canvasFormat,
    alphaMode: 'opaque'
  })
  ```
- 创建顶点数据Buffer

  ```ts
  const vertexBuffer = this.device.createBuffer({
    // 标识，字符串随意写，报错时会通过它定位
    label: 'Gpu Mesh',
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })
  device.queue.writeBuffer(vertexBuffer, 0, vertices)
  ```

- 创建BufferLayout提供更多信息
  ```ts
  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 2 * 4,
    attributes: [
      {
        format: 'float32x2',
        offset: 0,
        shaderLocation: 0
      }
    ]
  }
  ```
- 创建着色器Module

  ```ts
  const vertexShaderModule = this.device.createShaderModule({
    label: 'Mesh Shader',
    code: `
      ${this.shader.vertex}
  
      ${this.shader.fragment}
    `
  })
  ```

- 创建RenderPipeline

  ```ts
  const pipeline = this.device.createRenderPipeline({
    label: 'pipeline', // 标识，定位错误用
    layout: 'auto', // 自动流水线布局
    vertex: {
      module: vertexShaderModule, // 着色器模块
      entryPoint: 'vertexMain', // 入口函数为 vertexMain
      buffers: [vertexBufferLayout] // 读取缓冲区的方式
    },
    fragment: {
      module: vertexShaderModule,
      entryPoint: 'fragmentMain',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat() // 输出到 canvas 画布上
        }
      ]
    }
  })
  ```

- 创建encoder记录命令，声明开始渲染
  ```ts
  const encoder = device.createCommandEncoder()
  const renderPass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: this.canvasCtx.getCurrentTexture().createView(),
        loadOp: 'clear',
        clearValue: { r: 0, g: 0, b: 0.4, a: 0 },
        storeOp: 'store'
      }
    ]
  })
  ```
- 为uniform、storage绑定对应buffer，绑定group
  ```ts
  bindGroupEntries: Array<data & buffer>
  const bindGroup = device.createBindGroup({
    label: `Group`,
    layout: pipeline.getBindGroupLayout(0),
    entries: bindGroupEntries
  })
  pass.setBindGroup(0, bindGroup)
  ```
- 执行最后的绘制
  ```ts
  renderPass.setPipeline(pipeline)
  renderPass.setVertexBuffer(0, vertexBuffer)
  renderPass.draw(vertices.length / 2, this.instanceCount)
  renderPass.end() // 完成指令队列的记录
  const commandBuffer = encoder.finish() // 结束编码
  this.device.queue.submit([commandBuffer]) // 提交给 GPU 命令队列
  ```

着色器有自己的语言，这里就不展开讲解了，在上面那些代码中，还是有几点需要注意的：

- draw函数的第二个参数是instanceCount，代表实例数量。
- 着色器接受的输入，比如uniform、storage那些，如果没被使用会输出警告，还会导致渲染不出来

最后的最后，可以说，写的很零散，也越来越水，到后面只想结束，不想再做任何总结了。但是记录下这些对我来说还是有用的，但如果说有什么值得阅读的，或者浅显易懂那是不太可能的。接下来的一段时间应该研究一下GPUMesh的打包发布以及国际化文档生成相关的，当然也需要优化一下GPUMesh
