export default function ColorfulSegment({ className }: { className: string }) {
  return (
    <div className={`${className} grid h-60 w-full grid-flow-col bg-slate-500`}>
      {new Array(255).fill(0).map((item, i) => (
        <div
          className="h-3"
          key={i}
          style={{ background: `rgb(${i},${i},${i})` }}
        ></div>
      ))}
    </div>
  )
}
