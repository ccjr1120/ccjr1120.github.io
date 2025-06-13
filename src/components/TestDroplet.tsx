'use client'

import { motion } from 'framer-motion'

export default function TestDroplet() {
  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      initial={{ x: 100, y: 100 }}
      animate={{
        x: [100, 200, 300, 200, 100],
        y: [100, 150, 100, 50, 100],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {/* 明显的测试小球 */}
      <div
        className="rounded-full bg-black opacity-50"
        style={{
          width: '20px',
          height: '20px',
        }}
      />
    </motion.div>
  )
} 