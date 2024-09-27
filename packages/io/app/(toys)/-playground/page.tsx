import Link from 'next/link'
import { TwinkleCard } from '@/app/(main)/components/twinkle-card'
import { firstUpperCase } from '@/utils/string'

export default function Home() {
  return (
    <main className="flex gap-8">
      {['gpu-mesh'].map((title) => (
        <Link key={title} href={`/playground/${title.toLowerCase()}`}>
          <TwinkleCard className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-3xl text-2xl">
            {title.split('-').map(firstUpperCase).join(' ')}
          </TwinkleCard>
        </Link>
      ))}
    </main>
  )
}
