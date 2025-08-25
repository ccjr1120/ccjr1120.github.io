import RAFExample from '@/components/RAFExample'

export default function RAFDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            RAF 清空并重新渲染演示
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            这个页面展示了如何使用 useRAF Hook 来实现每次 RequestAnimationFrame 都清空并重新渲染的效果。
            适用于需要完全重新计算和渲染的动画场景，如游戏循环、粒子系统等。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">粒子系统示例</h2>
          <RAFExample />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">技术特点</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">核心功能</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 每次RAF都清空并重新计算所有状态</li>
                <li>• 支持自定义帧率控制</li>
                <li>• 自动生命周期管理</li>
                <li>• 手动控制开始/停止/强制渲染</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">适用场景</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 游戏循环和状态更新</li>
                <li>• 粒子效果和物理模拟</li>
                <li>• 实时数据可视化</li>
                <li>• 复杂动画系统</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
