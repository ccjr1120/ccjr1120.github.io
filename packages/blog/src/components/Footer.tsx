export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} CCJR. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ccjr1120"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            GitHub
          </a>
          <a
            href="/feed.xml"
            className="rounded-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  )
}
