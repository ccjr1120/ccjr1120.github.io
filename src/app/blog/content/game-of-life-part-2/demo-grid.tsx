'use client'

import { useLayoutEffect, useRef } from 'react'
// @ts-expect-error: TypeScript cannot resolve .wgsl files, but this is handled by the build system.
import vert from './vert.wgsl'

export default function DemoRect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (!canvasRef.current) return
    const init = async () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('webgpu')
      if (!ctx) return
      const adapter = await navigator.gpu.requestAdapter()
      const device = await adapter!.requestDevice()
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
      ctx.configure({
        device: device,
        format: canvasFormat
      })

      const vertices = new Float32Array([
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
      ])

      const vertexBuffer = device.createBuffer({
        // 变量名
        label: 'Cell vertices',
        // 所需要的内存大小，并不意味着要与顶点数据相同，只是我们只用到这些。
        size: vertices.byteLength,
        // 缓冲区的用法，不详解，这里是指该缓冲区用于顶点数据同时数据可以复制到其中
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      })

      device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices)

      const cellPipeline = device.createRenderPipeline({
        label: 'Cell pipeline',
        layout: 'auto',
        vertex: {
          module: device.createShaderModule({
            label: 'Vertex shader',
            code: vert
          }),
          entryPoint: 'vertexMain',
          buffers: [
            {
              arrayStride: 8,
              attributes: [
                {
                  format: 'float32x2',
                  offset: 0,
                  shaderLocation: 0
                }
              ]
            }
          ]
        },
        fragment: {
          module: device.createShaderModule({
            label: 'Fragment shader',
            code: `@fragment
                  fn fragmentMain() -> @location(0) vec4f {
                    return vec4f(0,0,0.8,1);
                  }`
          }),
          entryPoint: 'fragmentMain',
          targets: [
            {
              format: canvasFormat
            }
          ]
        }
      })
      // 创建一个GPUCommandEncoder，以提供用于记录 GPU 命令的接口。
      const encoder = device.createCommandEncoder()
      // 开始一个渲染通道，并设置相关参数
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: ctx.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store'
          }
        ]
      })
      // 设置渲染流水线
      pass.setPipeline(cellPipeline)
      // 设置顶点缓冲区
      pass.setVertexBuffer(0, vertexBuffer)
      // 绘制
      pass.draw(vertices.length / 2, 32 * 32) // 6 vertices
      // 结束渲染通道
      pass.end()
      // 完成渲染通道，并返回一个命令缓冲区
      const commandBuffer = encoder.finish()
      device.queue.submit([commandBuffer])
    }
    init()
  })
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '20px'
      }}
    >
      <canvas ref={canvasRef} width={400} height={400} style={{}} />
    </div>
  )
}
