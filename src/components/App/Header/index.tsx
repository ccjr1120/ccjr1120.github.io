import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center justify-between px-6 shadow-sm backdrop-blur-sm lg:px-36">
      <div>
        <Link href="/" className="flex items-center gap-4">
          <Image
            className="h-10 w-10 rounded-full"
            src="/images/avatar.png"
            alt="Avatar"
            width={40}
            height={40}
          />
          <h2 className="text-xl font-light text-white">匆匆孑然</h2>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <Link
          href="/blog"
          className="text-base font-light text-gray-600 transition-colors hover:font-medium hover:text-white"
        >
          博客
        </Link>
        <Link
          href="/models"
          className="text-base font-light text-gray-600 transition-colors hover:font-medium hover:text-white"
        >
          模型
        </Link>
      </div>
    </nav>
  )
}
