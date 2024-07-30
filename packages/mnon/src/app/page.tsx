export default function Home() {
  return (
    <main className="flex flex-col gap-12">
      {new Array(100).fill(0).map((item) => (
        <div key={item} className="article-item">
          <div className="text-pri text-2xl font-bold">The Two Reacts</div>
          <div className="mt-1 text-xs font-light">December 11, 2023</div>
          <div className="mt-1 text-base">UI = f(data)(state)</div>
        </div>
      ))}
    </main>
  )
}
