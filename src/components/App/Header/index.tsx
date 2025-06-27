import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="sticky top-0 z-[var(--app-nav-z-index)] flex h-[var(--app-nav-height)] w-full items-center justify-between bg-transparent px-36">
      <div>
        <Link href="/" className="flex items-center gap-4">
          <Image
            className="h-[32px] w-[32px] rounded-full"
            src="/images/avatar.png"
            alt="Avatar"
            width={32}
            height={32}
          />
          <h2 className="!font-light">匆匆孑然</h2>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <Link
          href="/blog"
          className="text font-light transition-colors hover:text-gray-600"
        >
          博客
        </Link>
        <Link
          href="/models"
          className="text font-light transition-colors hover:text-gray-600"
        >
          模型
        </Link>
      </div>
    </nav>
  )
}
