export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Responsive Container */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 md:px-12 lg:px-20">
        {/* Page Container */}
        <div className="relative flex min-h-screen flex-col">
          {/* Header */}
          <header className="flex h-20 w-full flex-shrink-0 items-center border-b border-gray-300 sm:h-24 md:h-28 lg:h-[120px]">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* Avatar */}
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20">
                <img
                  src="/images/avatar.png"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Name */}
              <h1 className="text-lg leading-tight font-normal text-black sm:text-xl md:text-2xl lg:text-[32px]">
                匆匆孑然
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20">
            {/* Content Group */}
            <div className="mx-auto w-full max-w-4xl">
              {/* Mobile Layout (< md) */}
              <div className="block md:hidden">
                <div className="flex flex-col items-center gap-6 sm:gap-8">
                  {/* Background Image */}
                  <div className="aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src="/images/background.png"
                      alt="Background"
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
              <div className="hidden items-center justify-center gap-8 md:flex lg:gap-16">
                {/* Background Image */}
                <div className="aspect-[3/4] w-64 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:w-80 xl:w-[459px]">
                  <img
                    src="/images/background.png"
                    alt="Background"
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
