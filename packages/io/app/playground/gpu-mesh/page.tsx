'use client'

import Gpu from '@ccjr/gpu-mesh'
import { useLayoutEffect, useRef } from 'react'

export default function GpuMesh() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirst = useRef(true)
  useLayoutEffect(() => {
    isFirst.current &&
      Gpu.Mesh.loadDevice().then(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Gpu.Mesh(containerRef.current!, {} as any)
      })
    isFirst.current = false
  }, [])
  return <div ref={containerRef} className="h-full w-full"></div>
}
