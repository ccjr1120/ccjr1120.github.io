'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface InkDropletProps {
  index?: number
}

export default function InkDroplet({ index = 0 }: InkDropletProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // 生成随机的初始位置和移动路径
  const generateRandomPath = () => {
    const points = []
    const numPoints = 6 // 简化为6个点
    const margin = 100
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: margin + Math.random() * Math.max(0, dimensions.width - 2 * margin),
        y: margin + Math.random() * Math.max(0, dimensions.height - 2 * margin),
      })
    }
    return points
  }

  const [path, setPath] = useState<Array<{x: number, y: number}>>([])

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setPath(generateRandomPath())
    }
  }, [dimensions.width, dimensions.height])

  // 动画配置
  const animation = path.length > 0 ? {
    x: path.map(point => point.x),
    y: path.map(point => point.y),
  } : { x: 100, y: 100 }

  const transition = {
    duration: 20 + Math.random() * 10, // 加快速度：20-30秒
    repeat: Infinity,
    repeatType: 'loop' as const,
    ease: 'linear' as const,
    delay: index * 2 // 减少延迟：每个小球延迟2秒启动
  }

  if (dimensions.width === 0) return null

  return (
    <motion.div
      className="pointer-events-none absolute z-10"
      initial={{ x: path[0]?.x || 100, y: path[0]?.y || 100 }}
      animate={animation}
      transition={transition}
    >
      {/* 主要的水墨小球 - 增强可见度 */}
      <div
        className="relative"
        style={{
          width: '16px',
          height: '16px',
        }}
      >
        {/* 外层光晕 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.05) 40%, transparent 70%)',
            transform: 'scale(3.5)',
            filter: 'blur(1px)',
          }}
        />
        
        {/* 中层扩散 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.08) 50%, transparent 80%)',
            transform: 'scale(2.5)',
            filter: 'blur(0.5px)',
          }}
        />
        
        {/* 核心小球 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.12) 60%, rgba(0, 0, 0, 0.04) 100%)',
            filter: 'blur(0.2px)',
          }}
        />
        
        {/* 最内层核心 */}
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.18) 100%)',
          }}
        />
      </div>
    </motion.div>
  )
} 