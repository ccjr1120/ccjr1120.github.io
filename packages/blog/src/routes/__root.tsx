import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#FEF5F6' }}>
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}
