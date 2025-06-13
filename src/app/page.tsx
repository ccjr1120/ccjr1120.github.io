import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div 
      className="max-h-screen min-h-screen overflow-hidden bg-white"
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.015) 1px, transparent 150px),
          linear-gradient(0deg, transparent 0px, rgba(0, 0, 0, 0.009) 1px, transparent 120px),
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.008) 1px, transparent 300px),
          linear-gradient(0deg, transparent 0px, rgba(0, 0, 0, 0.006) 1px, transparent 280px),
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.006) 1px, transparent 450px),
          linear-gradient(45deg, transparent 0px, rgba(0, 0, 0, 0.003) 1px, transparent 350px),
          linear-gradient(-45deg, transparent 0px, rgba(0, 0, 0, 0.004) 1px, transparent 380px),
          linear-gradient(30deg, transparent 0px, rgba(0, 0, 0, 0.002) 1px, transparent 500px)
        `,
        backgroundSize: '200px 200px, 180px 180px, 400px 400px, 350px 350px, 550px 550px, 450px 450px, 480px 480px, 600px 600px',
        backgroundPosition: '0 0, 25px 15px, 80px 40px, 120px 70px, 200px 100px, 0 0, 150px 80px, 250px 120px'
      }}
    >
      {/* Responsive Container */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 md:px-12 lg:px-20">
        {/* Page Container */}
        <div className="relative flex max-h-screen flex-col">
          {/* Header */}
          <header className="flex h-20 w-full flex-shrink-0 items-center justify-between border-b border-gray-300 sm:h-24 md:h-28 lg:h-[120px]">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* Avatar */}
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20">
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Name */}
              <h1 className="text-lg leading-tight font-normal text-black sm:text-xl md:text-2xl lg:text-[32px]">
                匆匆孑然
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center">
              <Link
                href="/models"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:px-4 sm:py-2 sm:text-base"
              >
                {/* Blender Icon SVG */}
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06m-9.679 0c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.984 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06M12 3.67c2.48 0 4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5-4.5-2.02-4.5-4.5 2.02-4.5 4.5-4.5zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                <span className="hidden sm:inline">3D 模型</span>
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center py-4 sm:py-6 md:py-8 lg:py-10">
            {/* Content Group */}
            <div className="mx-auto w-full max-w-4xl">
              {/* Mobile Layout (< md) */}
              <div className="block md:hidden">
                <div className="flex flex-col items-center gap-8 sm:gap-12">
                  {/* Background Image */}
                  <div className="aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src="/images/background.png"
                      alt="Background"
                      width={400}
                      height={433}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Text Container */}
                  <div className="px-4 text-center">
                    <div className="text-2xl leading-[1.6] font-normal tracking-[0.03em] text-black sm:text-3xl">
                      人间，不过
                      <br />
                      是你寄身之处
                      <br />
                      银河里
                      <br />
                      才是你
                      <br />
                      灵魂的徜徉地
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout (>= md) */}
              <div className="hidden items-center justify-center gap-12 md:flex lg:gap-20 xl:gap-24">
                {/* Background Image */}
                <div className="aspect-[3/4] w-64 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:w-80 xl:w-[459px]">
                  <Image
                    src="/images/background.png"
                    alt="Background"
                    width={459}
                    height={612}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text Container */}
                <div className="flex max-w-md flex-1 items-center lg:max-w-lg xl:max-w-[430px]">
                  <div className="text-2xl leading-[1.6] font-normal tracking-[0.03em] text-black lg:text-3xl xl:text-[40px]">
                    人间，不过
                    <br />
                    是你寄身之处
                    <br />
                    银河里
                    <br />
                    才是你
                    <br />
                    灵魂的徜徉地
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
