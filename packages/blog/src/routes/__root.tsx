import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { useTheme } from '@/lib/theme'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { theme } = useTheme()

  return (
    <div style={{ minHeight: '100vh', background: theme === 'dark' ? '#111827' : '#FEF5F6' }}>
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}
