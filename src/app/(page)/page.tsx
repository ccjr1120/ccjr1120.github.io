import bannerBg from '@/assets/images/banner_bg.jpg'

export default function Home() {
  return (
    <div id="banner" className="isolate bg-cover bg-center bg-no-repeat">
      <div
        className="absolute top-0 left-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `url(${bannerBg.src || bannerBg})`
        }}
      ></div>
      <div className="flex h-full w-full justify-center pt-64">
        <div className="text-start text-2xl font-light">
          人间, 不过是你寄身之处
          <br />
          银河里, 才是你灵魂的徜徉地
        </div>
      </div>
    </div>
  )
}
