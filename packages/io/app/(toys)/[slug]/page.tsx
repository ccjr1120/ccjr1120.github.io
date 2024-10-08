export async function generateStaticParams() {
  return [{ slug: 'gpu-mesh' }]
}

export default function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  return <section>{slug}</section>
}
