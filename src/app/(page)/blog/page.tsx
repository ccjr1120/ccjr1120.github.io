import Image from 'next/image'

export default function BlogPage() {
  return (
    <>
      {/* Content Group */}
      <div className="mx-auto flex h-full w-full max-w-4xl items-center justify-center">
        {/* Layout */}
        <div className="flex flex-1 items-center justify-between">
          {/* Background Image */}
          <div className="aspect-[3/4] w-80 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
            <Image
              src="/images/background.png"
              alt="Background"
              width={459}
              height={612}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Blog Content Container */}
          <div className="flex max-w-lg flex-1 items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-6">博客</h1>
              <div className="text-lg leading-relaxed text-gray-700 space-y-4">
                <p>欢迎来到我的博客</p>
                <p>这里记录着我的思考与感悟</p>
                <p>文字与生活的交汇处</p>
                <p>是灵魂最真实的表达</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
