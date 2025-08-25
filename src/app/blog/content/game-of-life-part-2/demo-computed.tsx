'use client'

import { useLayoutEffect, useRef } from 'react'
// @ts-expect-error: TypeScript cannot resolve .wgsl files, but this is handled by the build system.
import shader from './shader-computed.wgsl'

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
