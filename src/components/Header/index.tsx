import Link from 'next/link'

export default function Header() {
  return (
    <header className="relative mb-14 flex items-end justify-between py-4">
      <Link href={'/'}>
        <h1 className="text-2xl font-black tracking-wide">Blog</h1>
      </Link>
      <div className="avatar flex aspect-square w-12 items-center justify-center rounded-full bg-pri font-bold text-[#162c35]">
        fx
      </div>
    </header>
  )
}
