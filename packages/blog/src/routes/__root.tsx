import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Header } from '@/components/Header'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="px-8 py-8 text-xs text-text-muted">
        <div className="max-w-2xl mx-auto">
          &copy; {new Date().getFullYear()} CCJR
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
