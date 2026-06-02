import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const links = [
  { label: 'GitHub', href: 'https://github.com/ccjr1120', handle: '@ccjr1120', external: true },
  { label: 'RSS', href: '/feed.xml', handle: 'Subscribe', external: false },
]

function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FEF5F6', fontFamily: 'var(--font-sans)' }}>
      {/* TopBar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '36px 40px 24px' }}>
        <Link to="/" style={{ fontSize: '18px', color: '#321E26', textDecoration: 'none' }}>
          Home
        </Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '18px', color: '#321E26' }}>About</span>
        <div style={{ width: '80px' }} />
      </div>

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', paddingBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '56px',
            fontWeight: 700,
            color: '#321E26',
            margin: 0,
          }}
        >
          CCJR
        </h1>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        {/* Bio row */}
        <SectionRow label="Bio">
          <p style={{ fontSize: '15px', color: '#A57686', lineHeight: 1.7, margin: 0 }}>
            A developer who loves turning ideas into code and code into products.
          </p>
        </SectionRow>

        <Divider />

        {/* Links row */}
        <SectionRow label="Links">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                className="about-link-row"
              >
                <span style={{ fontSize: '15px', color: '#321E26' }}>{link.label}</span>
                <span style={{ fontSize: '13px', color: '#A57686' }}>{link.handle}</span>
              </a>
            ))}
          </div>
        </SectionRow>
      </div>
    </div>
  )
}

function SectionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '12px 0', fontWeight: 400 }}>
      <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
      <div style={{ flex: 1, height: '1px' }} />
      <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)' }} />
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CF5473' }} />
      <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)' }} />
      <div style={{ flex: 1, height: '1px' }} />
    </div>
  )
}
