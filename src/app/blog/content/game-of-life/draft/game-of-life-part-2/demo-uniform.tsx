'use client'

import { useLayoutEffect, useRef, useState } from 'react'
// @ts-expect-error: TypeScript cannot resolve .wgsl files, but this is handled by the build system.
import shader from './shader.wgsl'

const CELL_STATE = {
  DEAD: 0,
  LIVE: 1
}
const GRID_SIZE = 32

/**
 * 单细胞对象
 */
class Monad {
  index: number = 0
  state: typeof CELL_STATE.DEAD | typeof CELL_STATE.LIVE = CELL_STATE.DEAD
  constructor(index: number) {
    this.index = index
  }
  /**
   * 获取当前细胞的邻居索引（假设一维数组，二维网格，边界不越界）
   * @param cols 列数
   * @param rows 行数
   */
  getNeighborIndices(cols: number, rows: number): number[] {
    const neighbors: number[] = []
    const x = this.index % cols
    const y = Math.floor(this.index / cols)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          neighbors.push(ny * cols + nx)
        }
      }
    }
    return neighbors
  }

  /**
   * 根据邻居状态更新自身状态
   * @param cells 所有细胞对象的数组
   * @param cols 列数
   * @param rows 行数
   */
  updateState(cells: Monad[]) {
    const cols = GRID_SIZE
    const rows = GRID_SIZE
    const neighborIndices = this.getNeighborIndices(cols, rows)
    let liveCount = 0
    for (const idx of neighborIndices) {
      if (cells[idx].state === 1) liveCount++
    }
    if (this.state === 1) {
      // 存活细胞
      if (liveCount === 2 || liveCount === 3) {
        this.state = 1
      } else {
        this.state = 0
      }
    } else {
      // 死亡细胞
      if (liveCount === 3) {
        this.state = 1
      } else {
        this.state = 0
      }
    }
  }
}

/**
 * 渲染函数：执行 WebGPU 渲染逻辑
 */
async function render(
  canvas: HTMLCanvasElement,
  cells: Monad[],
  device: GPUDevice,
  canvasFormat: GPUTextureFormat
) {
  const ctx = canvas.getContext('webgpu')!

  // 创建符合着色器期望的 uniform 数据
  // 每个实例需要 4 个 float32 值: [存活状态, 年龄, 其他属性, 透明度]
  const uniformArray = new Float32Array(GRID_SIZE * GRID_SIZE * 4)

  for (let i = 0; i < cells.length; i++) {
    const offset = i * 4
    uniformArray[offset + 0] = cells[i].state // 存活状态 (0.0 或 1.0)
    uniformArray[offset + 1] = Math.random() * 5.0 // 年龄 (0.0 - 5.0)
    uniformArray[offset + 2] = 0.0 // 其他属性
    uniformArray[offset + 3] = 1.0 // 透明度
  }

  const uniformBuffer = device.createBuffer({
    label: 'Grid Uniforms',
    size: uniformArray.byteLength, // 应该是 16384 bytes
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
    // 变量名
    label: 'Cell vertices',
    // 所需要的内存大小，并不意味着要与顶点数据相同，只是我们只用到这些。
    size: vertices.byteLength,
    // 缓冲区的用法，不详解，这里是指该缓冲区用于顶点数据同时数据可以复制到其中
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices)

  const cellShader = device.createShaderModule({
    label: 'Cell shader',
    code: shader
  })
  const cellPipeline = device.createRenderPipeline({
    label: 'Cell pipeline',
    layout: 'auto',
    vertex: {
      module: cellShader,
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
      module: cellShader,
      entryPoint: 'fragmentMain',
      targets: [
        {
          format: canvasFormat
        }
      ]
    }
  })
  const bindGroup = device.createBindGroup({
    label: 'Cell renderer bind group',
    layout: cellPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer }
      }
    ]
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
  pass.setBindGroup(0, bindGroup)
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

/**
 * RAF 渲染循环函数
 */
function startRenderLoop(
  canvas: HTMLCanvasElement,
  cells: Monad[],
  device: GPUDevice,
  canvasFormat: GPUTextureFormat
) {
  let animationId: number

  const animate = async () => {
    // 更新细胞状态
    updateCells(cells)

    // 执行渲染
    await render(canvas, cells, device, canvasFormat)

    // 继续下一帧
    animationId = requestAnimationFrame(animate)
  }

  // 开始动画循环
  animate()

  // 返回停止函数
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }
}

/**
 * 更新所有细胞状态
 */
function updateCells(cells: Monad[]) {
  // 创建临时数组来存储新状态，避免在更新过程中影响邻居计算
  const newStates = new Array(cells.length)

  // 计算所有细胞的新状态
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const neighborIndices = cell.getNeighborIndices(GRID_SIZE, GRID_SIZE)
    let liveCount = 0

    for (const idx of neighborIndices) {
      if (cells[idx].state === CELL_STATE.LIVE) liveCount++
    }

    // 应用生命游戏规则
    if (cell.state === CELL_STATE.LIVE) {
      // 存活细胞
      if (liveCount === 2 || liveCount === 3) {
        newStates[i] = CELL_STATE.LIVE
      } else {
        newStates[i] = CELL_STATE.DEAD
      }
    } else {
      // 死亡细胞
      if (liveCount === 3) {
        newStates[i] = CELL_STATE.LIVE
      } else {
        newStates[i] = CELL_STATE.DEAD
      }
    }
  }

  // 应用新状态
  for (let i = 0; i < cells.length; i++) {
    cells[i].state = newStates[i]
  }
}

export default function DemoRect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cells] = useState<Monad[]>(
    Array.from(
      { length: GRID_SIZE * GRID_SIZE },
      (_, index) => new Monad(index)
    ).map((cell) => {
      cell.state = Math.random() > 0.7 ? CELL_STATE.LIVE : CELL_STATE.DEAD
      return cell
    })
  )

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

      // 启动渲染循环
      const stopRenderLoop = startRenderLoop(
        canvas,
        cells,
        device,
        canvasFormat
      )

      // 清理函数
      return () => {
        stopRenderLoop()
      }
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
