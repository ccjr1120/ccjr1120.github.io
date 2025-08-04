'use client'

import { useLayoutEffect } from 'react'

export default function Home() {
  useLayoutEffect(() => {
    window.location.replace('/blog')
  }, [])
  return null
}
