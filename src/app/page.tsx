import Image from 'next/image'
import Link from 'next/link'
import BackgroundLines from '@/components/BackgroundLines'

export default function Home() {
  return (
    <BackgroundLines className="max-h-screen min-h-screen overflow-hidden">
      {/* Container */}
      <div className="mx-auto h-screen max-w-[1440px] px-12">
        {/* Page Container */}
        <div className="relative flex h-screen flex-col">
          {/* Header */}
          <header className="flex h-20 w-full flex-shrink-0 items-center justify-between border-b border-gray-300">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Name */}
              <h2>匆匆孑然</h2>
            </div>

            {/* Navigation */}
            <nav className="flex items-center">
              <Link
                href="/models"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {/* Blender Icon SVG */}
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06m-9.679 0c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.984 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06M12 3.67c2.48 0 4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5-4.5-2.02-4.5-4.5 2.02-4.5 4.5-4.5zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center py-8">
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

                {/* Text Container */}
                <div className="flex max-w-lg flex-1 items-center justify-center">
                  <div className="text-3xl leading-[1.6] font-normal tracking-[0.03em] text-black">
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
    </BackgroundLines>
  )
}
