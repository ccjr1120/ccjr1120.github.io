'use client'

import Gpu from '@ccjr/gpu-mesh'
import { useLayoutEffect, useRef } from 'react'

export default function GpuMesh() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirst = useRef(true)
  const GRID_SIZE = 60
  function rafRender() {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''
    const cellStateStorage = new Uint32Array(GRID_SIZE * GRID_SIZE)
    for (
      let j = 0;
      j < cellStateStorage.length;
      j += Math.floor(Math.random() * 3 + 1)
    ) {
      cellStateStorage[j] = 1
    }
    Gpu.Mesh.loadDevice().then(
      () =>
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
    )
  }
  useLayoutEffect(() => {
    isFirst.current && rafRender()
    isFirst.current = false
  }, [])
  return (
    <div className="fixed inset-x-0 -z-10 aspect-square opacity-0">
      <div className="absolute inset-0 z-10 bg-slate-700 opacity-90" />
      <div
        ref={containerRef}
        className="absolute inset-x-0 -z-10 aspect-square"
      ></div>
    </div>
  )
}
