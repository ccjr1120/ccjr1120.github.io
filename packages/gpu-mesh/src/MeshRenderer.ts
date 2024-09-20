export type RenderParams = {
  canvas: HTMLCanvasElement
  device: GPUDevice
  shader: { vertex: string; fragment: string }
  vertices: Float32Array
  attributes?: { [key: string]: number[] }
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
    this.canvasCtx = this.setupCanvasContext()
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
    return ctx
  }

  render() {
    const device = this.device
    const vertices = this.vertices
    const vertexShaderModule = this.createShaderModule()
    const { vertexBuffer, vertexBufferLayout } = this.createVertexBL()
    device.queue.writeBuffer(vertexBuffer, 0, vertices)
    const encoder = device.createCommandEncoder()
    const pipeline = this.createPipeline({
      vertexShaderModule,
      vertexBufferLayout
    })
    const renderPass = this.createRenderPass(encoder)
    renderPass.setPipeline(pipeline)
    renderPass.setVertexBuffer(0, vertexBuffer)
    renderPass.draw(vertices.length / 2)
    renderPass.end() // 完成指令队列的记录
    const commandBuffer = encoder.finish() // 结束编码
    this.device.queue.submit([commandBuffer]) // 提交给 GPU 命令队列
  }

  private createVertexBL() {
    const vertices = this.vertices
    const vertexBuffer = this.device.createBuffer({
      // 标识，字符串随意写，报错时会通过它定位
      label: 'Gpu Mesh',
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
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
    return { vertexBuffer, vertexBufferLayout }
  }

  private createPipeline({
    vertexShaderModule,
    vertexBufferLayout
  }: {
    vertexShaderModule: GPUShaderModule
    vertexBufferLayout: GPUVertexBufferLayout
  }) {
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
    return pipeline
  }

  private createShaderModule() {
    const vertexShaderModule = this.device.createShaderModule({
      label: 'Mesh Shader',
      code: `
      @vertex
      ${this.shader.vertex}
  
      @fragment
      ${this.shader.fragment}
    `
    })
    return vertexShaderModule
  }

  private createRenderPass(encoder: GPUCommandEncoder) {
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.canvasCtx.getCurrentTexture().createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          storeOp: 'store'
        }
      ]
    })
    return renderPass
  }
}
