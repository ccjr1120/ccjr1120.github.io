'use client'
import { useLayoutEffect, useRef } from 'react'

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    ;(async () => {
      if (!navigator.gpu) {
        console.error('WebGPU 不支持')
        return
      }
    })()
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
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
