'use client' // 客户端组件标志

import { useLayoutEffect, useRef } from 'react' // 导入React钩子

const GRID_SIZE = 64 // 网格大小设置为64x64

// WGSL计算着色器 - Game of Life逻辑
const gameOfLifeComputeShader = `
  @group(0) @binding(0) var<storage, read> cellStateIn: array<u32>;
  @group(0) @binding(1) var<storage, read_write> cellStateOut: array<u32>;
  @group(0) @binding(2) var<uniform> grid: vec2f;
  
  fn cellIndex(cell: vec2u) -> u32 {
    return (cell.y % u32(grid.y)) * u32(grid.x) + (cell.x % u32(grid.x));
  }
  
  fn cellActive(x: u32, y: u32) -> u32 {
    return cellStateIn[cellIndex(vec2(x, y))];
  }
  
  @compute @workgroup_size(8, 8)
  fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
    // 检查是否在网格范围内
    if (cell.x >= u32(grid.x) || cell.y >= u32(grid.y)) {
      return;
    }
    
    // 计算活邻居数量
    let activeNeighbors = cellActive(cell.x+1, cell.y+1) +
                         cellActive(cell.x+1, cell.y) +
                         cellActive(cell.x+1, cell.y-1) +
                         cellActive(cell.x, cell.y-1) +
                         cellActive(cell.x-1, cell.y-1) +
                         cellActive(cell.x-1, cell.y) +
                         cellActive(cell.x-1, cell.y+1) +
                         cellActive(cell.x, cell.y+1);
    
    let i = cellIndex(cell.xy);
    
    // Conway's Game of Life 规则
    switch activeNeighbors {
      case 2: { // 2个邻居：保持当前状态
        cellStateOut[i] = cellStateIn[i];
      }
      case 3: { // 3个邻居：细胞存活
        cellStateOut[i] = 1;
      }
      default: { // 其他情况：细胞死亡
        cellStateOut[i] = 0;
      }
    }
  }
`

// WGSL渲染着色器
const renderShader = `
  struct VertexInput {
    @location(0) pos: vec2f,
    @builtin(instance_index) instance: u32,
  }
  
  struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) cell: vec2f,
  }
  
  @group(0) @binding(0) var<uniform> grid: vec2f;
  @group(0) @binding(1) var<storage> cellState: array<u32>;
  
  @vertex
  fn vertexMain(input: VertexInput) -> VertexOutput {
    let i = f32(input.instance);
    let cell = vec2f(i % grid.x, floor(i / grid.x));
    let state = f32(cellState[input.instance]);
    
    let cellOffset = cell / grid * 2;
    let gridPos = (input.pos * state + 1) / grid - 1 + cellOffset;
    
    var output: VertexOutput;
    output.pos = vec4f(gridPos, 0, 1);
    output.cell = cell / grid;
    return output;
  }
  
  @fragment
  fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell;
    // 活细胞显示为绿色
    return vec4f(0.0, 1.0, 0.2, 1.0);
  }
`

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    if (!canvasRef.current) return
    ;(async () => {
      // 检查WebGPU支持
      if (!navigator.gpu) {
        console.error('WebGPU 不支持')
        return
      }

      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        console.error('无法获取 WebGPU 适配器')
        return
      }

      const device = await adapter.requestDevice()
      const canvas = canvasRef.current!
      const context = canvas.getContext('webgpu')
      if (!context) {
        console.error('无法获取 WebGPU 上下文')
        return
      }

      const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device: device,
        format: canvasFormat
      })

      // 设置uniform数据（网格尺寸）
      const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE])
      const uniformBuffer = device.createBuffer({
        label: 'Grid Uniforms',
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

      // 创建顶点数据（正方形）
      const vertices = new Float32Array([
        -0.8,
        -0.8, // 三角形1
        0.8,
        -0.8,
        0.8,
        0.8,
        -0.8,
        -0.8, // 三角形2
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
      device.queue.writeBuffer(vertexBuffer, 0, vertices)

      const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [
          {
            format: 'float32x2',
            offset: 0,
            shaderLocation: 0 // 对应@location(0)
          }
        ]
      }

      // 创建细胞状态存储缓冲区（双缓冲）
      const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE)

      // 随机初始化状态
      for (let i = 0; i < cellStateArray.length; i++) {
        cellStateArray[i] = Math.random() > 0.7 ? 1 : 0
      }

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

      device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)

      // 创建渲染管线
      const cellShaderModule = device.createShaderModule({
        label: 'Cell shader',
        code: renderShader
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

      // 创建计算管线
      const simulationShaderModule = device.createShaderModule({
        label: 'Game of Life simulation shader',
        code: gameOfLifeComputeShader
      })

      const simulationPipeline = device.createComputePipeline({
        label: 'Simulation pipeline',
        layout: 'auto',
        compute: {
          module: simulationShaderModule,
          entryPoint: 'computeMain'
        }
      })

      // 创建绑定组
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

      const computeBindGroups = [
        device.createBindGroup({
          label: 'Compute bind group A',
          layout: simulationPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: { buffer: cellStateStorage[0] }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[1] }
            },
            {
              binding: 2,
              resource: { buffer: uniformBuffer }
            }
          ]
        }),
        device.createBindGroup({
          label: 'Compute bind group B',
          layout: simulationPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: { buffer: cellStateStorage[1] }
            },
            {
              binding: 1,
              resource: { buffer: cellStateStorage[0] }
            },
            {
              binding: 2,
              resource: { buffer: uniformBuffer }
            }
          ]
        })
      ]

      let step = 0

      const updateGrid = () => {
        // 计算着色器
        const encoder = device.createCommandEncoder()

        const computePass = encoder.beginComputePass()
        computePass.setPipeline(simulationPipeline)
        computePass.setBindGroup(0, computeBindGroups[step % 2])
        const workgroupCount = Math.ceil(GRID_SIZE / 8)
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount)
        computePass.end()

        step++

        // 渲染通道
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0.1, a: 1.0 },
              storeOp: 'store'
            }
          ]
        })

        pass.setPipeline(cellPipeline)
        pass.setBindGroup(0, bindGroups[step % 2])
        pass.setVertexBuffer(0, vertexBuffer)
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE)

        pass.end()
        device.queue.submit([encoder.finish()])
      }

      // 启动动画循环
      const UPDATE_INTERVAL = 100 // 每100ms更新一次
      const intervalId = setInterval(updateGrid, UPDATE_INTERVAL)

      // 清理函数
      return () => {
        clearInterval(intervalId)
      }
    })()
  }, [])

  // 返回组件渲染内容
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold">
          Conway&apos;s Game of Life (WGSL GPU加速)
        </h3>
        <p className="text-sm text-gray-600">
          WebGPU + WGSL 计算着色器加速版细胞自动机
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
          style={{
            width: '400px',
            height: '400px'
          }}
        />
      </div>
    </div>
  )
}
