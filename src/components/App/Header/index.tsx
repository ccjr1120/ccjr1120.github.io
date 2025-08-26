import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center px-6 shadow-sm backdrop-blur-sm lg:px-36">
      <div>
        <Link href="/" className="flex items-center gap-4">
          <Image
            className="h-10 w-10 rounded-full opacity-80"
            src="/images/avatar.png"
            alt="Avatar"
            width={40}
            height={40}
          />
          <h2
            className="text-xl font-light"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            匆匆孑然
          </h2>
        </Link>
      </div>
    </nav>
  )
}
