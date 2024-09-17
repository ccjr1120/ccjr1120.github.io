export type RenderParams = {
  canvas: HTMLCanvasElement
  device: GPUDevice
  shader: { vertex: string; fragment: string }
  vertices: number[]
  attributes: { [key: string]: number[] }
}

export default class MeshRenderer {
  device: GPUDevice
  shader: RenderParams['shader']
  vertices: RenderParams['vertices']
  attributes: RenderParams['attributes']
  canvas: HTMLCanvasElement
  canvasCtx: GPUCanvasContext
  constructor({ shader, vertices, attributes, device, canvas }: RenderParams) {
    this.shader = shader
    this.vertices = vertices
    this.attributes = attributes
    this.canvas = canvas
    this.device = device
    const { ctx } = this.setupCanvasContext()
    this.canvasCtx = ctx
  }

  private setupCanvasContext() {
    const ctx = this.canvas.getContext('webgpu')
    if (!ctx) throw new Error('WebGPU not supported')
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
    ctx.configure({
      device: this.device,
      format: canvasFormat,
      alphaMode: 'opaque'
    })
    return { ctx }
  }

  render() {
    const a = 1 // 缩放系数
    const points = 100 // 顶点数量
    const vertices = []

    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * 2 * Math.PI
      const x = a * (3 * Math.sin(theta) - Math.sin(3 * theta))
      const y = a * (3 * Math.cos(theta) - Math.cos(3 * theta))
      vertices.push(x, y)
    }
    const vertexArray = new Float32Array(vertices)
    const vertexBuffer = this.device.createBuffer({
      // 标识，字符串随意写，报错时会通过它定位
      label: 'Triangle Vertices',
      // 缓冲区大小，这里是 24 字节。6 个 4 字节（即 32 位）的浮点数
      size: vertexArray.byteLength,
      // 标识缓冲区用途（1）用于顶点着色器（2）可以从CPU复制数据到缓冲区
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    })
    this.device.queue.writeBuffer(
      vertexBuffer,
      /* bufferOffset */ 0,
      vertexArray
    )
    const vertexBufferLayout = {
      // 每组读 8 个字节。一个坐标为两个浮点数（2 * 4字节）
      arrayStride: 2 * 4,
      attributes: [
        {
          // 指定数据格式，这样WebGPU才知道该如何解析，格式为2个32位浮点数
          format: 'float32x2',
          offset: 0, // 从每组的第一个数字开始
          shaderLocation: 0 // 顶点着色器中的位置
        }
      ]
    }
    // 创建着色器模块
    const vertexShaderModule = this.device.createShaderModule({
      label: 'Vertex Shader',
      code: `
      @vertex
      fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
        return vec4f(pos, 0, 1);
      }
  
      @fragment
      fn fragmentMain() -> @location(0) vec4f {
        return vec4f(1, 0, 0, 1);
      }
    `
    })
    const pipeline = this.device.createRenderPipeline({
      label: 'pipeline', // 标识，定位错误用
      layout: 'auto', // 自动流水线布局
      vertex: {
        module: vertexShaderModule, // 着色器模块
        entryPoint: 'vertexMain', // 入口函数为 vertexMain
        buffers: [vertexBufferLayout] as never // 读取缓冲区的方式
      },
      fragment: {
        module: vertexShaderModule,
        entryPoint: 'fragmentMain',
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat() // 输出到 canvas 画布上
          }
        ]
      },
      primitive: {
        topology: 'line-strip'
      }
    })
    const encoder = this.device.createCommandEncoder()
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.canvasCtx.getCurrentTexture().createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          storeOp: 'store'
        }
      ]
    })

    pass.setPipeline(pipeline)
    pass.setVertexBuffer(0, vertexBuffer)
    pass.draw(vertices.length / 2)
    pass.end() // 完成指令队列的记录
    const commandBuffer = encoder.finish() // 结束编码
    this.device.queue.submit([commandBuffer]) // 提交给 GPU 命令队列
  }
}
