import ColorfulSegment from './ColorfulSegment'

export default function Header() {
  return (
    <header className="relative flex justify-between py-4 pb-64 align-bottom">
      <div className="avatar bg-pri flex aspect-square w-12 items-center justify-center rounded-full font-bold text-[#162c35]">
        FX
      </div>
      <nav>
        <ul className="flex h-full items-end">
          <li className="text-xl">博客</li>
        </ul>
      </nav>
      <ColorfulSegment className="absolute bottom-0" />
    </header>
  )
}
