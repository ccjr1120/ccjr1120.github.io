'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'

import { Model, getModels } from '../../../public/models/models-list'

function ModelViewer({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)
  return <primitive object={scene} scale={1} />
}

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
    </div>
  )
}

// 格式化时间显示
function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 计算相对时间
function getRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays} 天前`
  } else if (diffHours > 0) {
    return `${diffHours} 小时前`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} 分钟前`
  } else {
    return '刚刚'
  }
}

// 模型列表现在从自动生成的文件中导入

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = () => {
    try {
      setLoading(true)
      const loadedModels = getModels()
      setModels(loadedModels)

      // 默认选择第一个模型
      if (loadedModels.length > 0) {
        setSelectedModel(loadedModels[0])
      }
    } catch (err) {
      setError('Error loading models')
      console.error('Error loading models:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="mb-2 text-2xl font-bold">错误</h2>
          <p>{error}</p>
          <button
            onClick={loadModels}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <div className="flex h-full">
        {/* 左侧模型列表 */}
        <div className="flex w-80 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <h1 className="text-xl font-bold text-gray-800">3D 模型库</h1>
            <p className="mt-1 text-sm text-gray-600">
              共 {models.length} 个模型
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {models.length === 0 ? (
              <div className="p-4 text-center text-gray-500">暂无模型文件</div>
            ) : (
              <div className="p-2">
                {models.map((model) => (
                  <div
                    key={model.name}
                    onClick={() => setSelectedModel(model)}
                    className={`mb-2 cursor-pointer rounded-lg p-3 transition-colors ${
                      selectedModel?.name === model.name
                        ? 'border-2 border-blue-200 bg-blue-50'
                        : 'border-2 border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="truncate font-medium text-gray-800">
                      {model.name}
                    </div>
                    <div className="mt-1 space-y-1 text-xs text-gray-500">
                      <div>
                        {model.extension.toUpperCase()} • {model.size}
                      </div>
                      <div>创建: {getRelativeTime(model.createdTime)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex flex-1 flex-col">
          {selectedModel ? (
            <>
              {/* 顶部信息栏 */}
              <div className="border-b border-gray-200 bg-white p-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedModel.name}
                </h2>
                <div className="mt-2 flex gap-4 text-sm text-gray-600">
                  <span>文件大小: {selectedModel.size}</span>
                  <span>
                    创建时间: {formatDateTime(selectedModel.createdTime)}
                  </span>
                </div>
              </div>

              {/* 3D 模型展示区域 */}
              <div className="min-h-0 flex-1 p-4">
                <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    style={{ background: '#f8fafc' }}
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight
                      position={[-10, -10, -5]}
                      intensity={0.3}
                    />
                    <Suspense fallback={null}>
                      <ModelViewer modelUrl={selectedModel.url} />
                    </Suspense>
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      maxDistance={10}
                      minDistance={1}
                    />
                  </Canvas>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  使用鼠标拖拽旋转、滚轮缩放、右键平移 3D 模型
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-white">
              <div className="text-center text-gray-500">
                <div className="mb-4 text-6xl">🎯</div>
                <h3 className="mb-2 text-xl font-medium">选择一个 3D 模型</h3>
                <p>从左侧列表中选择一个模型来预览</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
