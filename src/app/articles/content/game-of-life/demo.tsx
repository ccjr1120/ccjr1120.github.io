'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three/webgpu'

export default function GameOfLife() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    let renderer: THREE.WebGPURenderer
    let cube: THREE.Mesh

    async function init() {
      // 创建摄像机
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 5

      // 创建场景
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)

      // 创建WebGPU渲染器
      renderer = new THREE.WebGPURenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setAnimationLoop(animate)

      // 将渲染器的DOM元素添加到容器
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement)
      }

      // 等待WebGPU初始化
      await renderer.init()

      // 创建立方体几何体
      const geometry = new THREE.BoxGeometry(1, 1, 1)

      // 创建材质
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: false
      })

      // 创建立方体网格
      cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      // 添加光源
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0.5, 0.5, 0.5).normalize()
      scene.add(directionalLight)

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
      scene.add(ambientLight)
    }

    function animate() {
      // 旋转立方体
      if (cube) {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
      }

      // 渲染场景
      renderer.render(scene, camera)
    }

    function onWindowResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    // 初始化场景
    init().catch(console.error)

    // 添加窗口大小调整监听器
    window.addEventListener('resize', onWindowResize)

    // 清理函数
    return () => {
      window.removeEventListener('resize', onWindowResize)
      if (renderer) {
        renderer.dispose()
      }
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    />
  )
}
