import Link from 'next/link'

export default function Header() {
  return (
    <header className="relative mb-14 flex items-end justify-between py-4">
      <div className="flex gap-1">
        <Link href={'/'}>
          <h1 className="text-2xl font-black tracking-wide">Home</h1>
        </Link>
        <Link href={'/nav'}>
          {/* <svg
            width="16"
            height="16"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42 19H5.99998"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 7L42 19"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.79897 29H42.799"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.79895 29L18.799 41"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </Link>
      </div>
      <div className="avatar bg-pri flex aspect-square w-12 items-center justify-center rounded-full font-bold text-[#162c35]">
        Fx
      </div>
    </header>
  )
}
