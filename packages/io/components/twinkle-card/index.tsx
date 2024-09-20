export function TwinkleCard({
  children,
  className
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <div className={`twinkle-card-wrapper`}>
      <div className={`twinkle-card ${className}`}>{children}</div>
    </div>
  )
}
