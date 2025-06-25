import Image from 'next/image'

export default function Home() {
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
    </>
  )
}
