'use client'

import Gpu from '@ccjr/gpu-mesh'
import { useLayoutEffect, useRef } from 'react'

export default function GpuMesh() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirst = useRef(true)
  useLayoutEffect(() => {
    isFirst.current &&
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
          shader: {
            vertex: `    
            fn vertexMain(@location(0) pos: vec2f) ->
              @builtin(position) vec4f {
              return vec4f(pos, 0, 1);
            }`,
            fragment: `
            fn fragmentMain() -> @location(0) vec4f {
              return vec4f(1, 0, 0, 1);
            }`
          }
        })
      })
    isFirst.current = false
  }, [])
  return <div ref={containerRef} className="h-full w-full"></div>
}
