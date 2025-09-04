'use client'

import { useLayoutEffect, useRef } from 'react'
// @ts-expect-error: TypeScript cannot resolve .wgsl files, but this is handled by the build system.
import shaderString from './shader-computed.wgsl'
// @ts-expect-error: TypeScript cannot resolve .wgsl files, but this is handled by the build system.
import computedShaderString from './computed-shader.wgsl'

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

      const GRID_SIZE = 32
      let step = 0
      const UPDATE_INTERVAL = 20
      const vertices = new Float32Array([
        -0.8, -0.8, 0.8, -0.8, 0.8, 0.8, -0.8, -0.8, 0.8, 0.8, -0.8, 0.8
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

      const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE])
      const uniformBuffer = device.createBuffer({
        label: 'Grid Uniforms',
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

      const shader = device.createShaderModule({
        label: 'Shader',
        code: shaderString
      })
      const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE)
      const cellStateStorage = [
        device.createBuffer({
          label: 'Cell State A',
          size: cellStateArray.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        }),
        device.createBuffer({
          label: 'Cell State B',
          size: cellStateArray.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        })
      ]
      for (let i = 0; i < cellStateArray.length; ++i) {
        cellStateArray[i] = Math.random() > 0.6 ? 1 : 0
      }
      device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)
      for (let i = 0; i < cellStateArray.length; i++) {
        cellStateArray[i] = i % 2
      }
      device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray)
      // Create a bind group to pass the grid uniforms into the pipeline
      const bindGroupLayout = device.createBindGroupLayout({
        label: 'Cell Bind Group Layout',
        entries: [
          {
            binding: 0,
            visibility:
              GPUShaderStage.VERTEX |
              GPUShaderStage.COMPUTE |
              GPUShaderStage.FRAGMENT,
            buffer: {} // Grid uniform buffer
          },
          {
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
            buffer: { type: 'read-only-storage' } // Cell state input buffer
          },
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' } // Cell state output buffer
          }
        ]
      })
      const bindGroups = [
        device.createBindGroup({
          label: 'Cell renderer bind group A',
          layout: bindGroupLayout, // Updated Line
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[0] }
            },
            {
              binding: 2, // New Entry
              resource: { buffer: cellStateStorage[1] }
            }
          ]
        }),
        device.createBindGroup({
          label: 'Cell renderer bind group B',
          layout: bindGroupLayout, // Updated Line

          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[1] }
            },
            {
              binding: 2, // New Entry
              resource: { buffer: cellStateStorage[0] }
            }
          ]
        })
      ]
      const simulationShaderModule = device.createShaderModule({
        label: 'Game of Life simulation shader',
        code: computedShaderString
      })
      const pipelineLayout = device.createPipelineLayout({
        label: 'Cell Pipeline Layout',
        bindGroupLayouts: [bindGroupLayout]
      })
      // Create a compute pipeline that updates the game state.
      const simulationPipeline = device.createComputePipeline({
        label: 'Simulation pipeline',
        layout: pipelineLayout,
        compute: {
          module: simulationShaderModule,
          entryPoint: 'computeMain'
        }
      })
      const cellPipeline = device.createRenderPipeline({
        label: 'Cell pipeline',
        layout: pipelineLayout,
        vertex: {
          module: shader,
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
          module: shader,
          entryPoint: 'fragmentMain',
          targets: [
            {
              format: canvasFormat
            }
          ]
        }
      })
      step++
      function updateGrid() {
        step++
        const encoder = device.createCommandEncoder()
        const computePass = encoder.beginComputePass()
        computePass.setPipeline(simulationPipeline)
        computePass.setBindGroup(0, bindGroups[step % 2])
        const workgroupCount = Math.ceil(GRID_SIZE / 8)
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount)
        computePass.end()
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: ctx!.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
              storeOp: 'store'
            }
          ]
        })
        pass.setPipeline(cellPipeline)
        pass.setBindGroup(0, bindGroups[step % 2])
        pass.setVertexBuffer(0, vertexBuffer)
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE) // 6 vertices
        pass.end()
        const commandBuffer = encoder.finish()
        device.queue.submit([commandBuffer])
      }
      updateGrid()
      setInterval(updateGrid, UPDATE_INTERVAL)
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
