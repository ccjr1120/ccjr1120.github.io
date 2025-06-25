import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="fixed top-0 mx-auto flex h-16 w-full items-center justify-between px-12">
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
    </nav>
  )
}
