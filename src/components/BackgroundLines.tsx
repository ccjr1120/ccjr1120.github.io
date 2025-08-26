
interface BackgroundLinesProps {
  children: React.ReactNode
  className?: string
}

export default function BackgroundLines({
  children,
  className = ''
}: BackgroundLinesProps) {
  return (
    <div
      className={`relative bg-white ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.015) 1px, transparent 150px),
          linear-gradient(0deg, transparent 0px, rgba(0, 0, 0, 0.009) 1px, transparent 120px),
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.008) 1px, transparent 300px),
          linear-gradient(0deg, transparent 0px, rgba(0, 0, 0, 0.006) 1px, transparent 280px),
          linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.006) 1px, transparent 450px),
          linear-gradient(45deg, transparent 0px, rgba(0, 0, 0, 0.003) 1px, transparent 350px),
          linear-gradient(-45deg, transparent 0px, rgba(0, 0, 0, 0.004) 1px, transparent 380px),
          linear-gradient(30deg, transparent 0px, rgba(0, 0, 0, 0.002) 1px, transparent 500px)
        `,
        backgroundSize:
          '200px 200px, 180px 180px, 400px 400px, 350px 350px, 550px 550px, 450px 450px, 480px 480px, 600px 600px',
        backgroundPosition:
          '0 0, 25px 15px, 80px 40px, 120px 70px, 200px 100px, 0 0, 150px 80px, 250px 120px'
      }}
    >
      {children}
    </div>
  )
}
