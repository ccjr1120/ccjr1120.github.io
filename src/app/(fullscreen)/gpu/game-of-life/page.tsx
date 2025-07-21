'use client'

import { useLayoutEffect } from 'react'
import { vertexShaderCode, fragmentShaderCode, combineShaders } from './shaders'

export default function GameOfLife() {
  useLayoutEffect(() => {
    ;(async () => {
      const GRID_SIZE = 32
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) return

      const device = await adapter.requestDevice()
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const context = canvas.getContext('webgpu')
      if (!context) return
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device: device,
        format: canvasFormat
      })
      const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE])
      const uniformBuffer = device.createBuffer({
        label: 'Grid Uniforms',
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      device.queue.writeBuffer(uniformBuffer, 0, uniformArray)
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
        label: 'Cell vertices',
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      })
      device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices)

      const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [
          {
            format: 'float32x2' as GPUVertexFormat,
            offset: 0,
            shaderLocation: 0 // Position, see vertex shader
          }
        ]
      }

      const cellShaderModule = device.createShaderModule({
        label: 'Cell shader',
        code: combineShaders(vertexShaderCode, fragmentShaderCode)
      })
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
      // Create an array representing the active state of each cell.
      const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE)

      // Create a storage buffer to hold the cell state.
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
      for (let i = 0; i < cellStateArray.length; i += 3) {
        cellStateArray[i] = 1
      }
      device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)

      // Mark every other cell of the second grid as active.
      for (let i = 0; i < cellStateArray.length; i++) {
        cellStateArray[i] = i % 2
      }
      device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray)
      const bindGroups = [
        device.createBindGroup({
          label: 'Cell renderer bind group A',
          layout: cellPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[0] }
            }
          ]
        }),
        device.createBindGroup({
          label: 'Cell renderer bind group B',
          layout: cellPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[1] }
            }
          ]
        })
      ]
      const encoder = device.createCommandEncoder()
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: { r: 0, g: 0, b: 0.4, a: 1 }, // New line
            storeOp: 'store'
          }
        ]
      })
      pass.setPipeline(cellPipeline)
      pass.setVertexBuffer(0, vertexBuffer)
      pass.setBindGroup(0, bindGroups[0])
      pass.setBindGroup(1, bindGroups[1])
      pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE)
      pass.end()
      device.queue.submit([encoder.finish()])
      const UPDATE_INTERVAL = 200 // Update every 200ms (5 times/sec)
      let step = 0 // Track how many simulation steps have been run
      // Move all of our rendering code into a function
      function updateGrid() {
        step++ // Increment the step count

        // Start a render pass
        const encoder = device.createCommandEncoder()
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context!.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
              storeOp: 'store'
            }
          ]
        })

        // Draw the grid.
        pass.setPipeline(cellPipeline)
        pass.setBindGroup(0, bindGroups[step % 2]) // Updated!
        pass.setVertexBuffer(0, vertexBuffer)
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE)

        // End the render pass and submit the command buffer
        pass.end()
        device.queue.submit([encoder.finish()])
      }

      // Schedule updateGrid() to run repeatedly
      setInterval(updateGrid, UPDATE_INTERVAL)
    })()
  }, [])

  return (
    <div className="mx-auto h-screen w-2xl py-18">
      <div className="h-full border flex justify-center items-center">
        <canvas id="canvas" className="w-[400px] h-[400px]"></canvas>
      </div>
    </div>
  )
}
