import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const techStack = {
  前端: { items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'], accent: 'primary' as const },
  后端: { items: ['Node.js', 'Python'], accent: 'muted' as const },
  工具: { items: ['Git', 'Docker', 'Linux'], accent: 'muted' as const },
}

const accentClass = {
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-surface-muted text-text-muted',
}

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/ccjr1120',
    handle: '@ccjr1120',
    external: true,
  },
  {
    label: 'RSS',
    href: '/feed.xml',
    handle: '订阅更新',
    external: false,
  },
]

function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="mb-12">
        <p className="font-mono text-sm text-text-muted">// 关于我</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          你好，我是 <span className="text-primary">CCJR</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-muted">
          一名开发者，喜欢把想法落成代码，把代码落成产品。
        </p>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(0,1fr)]">
        {/* Bio - large */}
        <article className="md:col-span-2 lg:row-span-2 flex flex-col rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="text-2xl font-bold">关于这个博客</h2>
          <div className="mt-4 space-y-4 text-text-muted">
            <p>
              这里是我的个人博客，用来记录技术学习、项目经验和一些零碎的思考。文章不追求多，但希望每一篇都能解决一个具体的问题或者沉淀一段真实的实践。
            </p>
            <p>
              我相信好的工具能极大放大开发者的杠杆，也相信简单、可读、可维护的代码胜过炫技。如果你在某篇文章里有共鸣或不同看法，欢迎在 GitHub 找我聊。
            </p>
          </div>
          <div className="mt-auto pt-8">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Web 开发
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted">
                工程实践
              </span>
              <span className="inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted">
                工具与效率
              </span>
            </div>
          </div>
        </article>

        {/* Tech stack */}
        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold">技术栈</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(techStack).map(([group, { items, accent }]) => (
              <div key={group}>
                <p className="font-mono text-xs uppercase tracking-wider text-text-muted">{group}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${accentClass[accent]}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Contact */}
        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold">联系方式</h2>
          <ul className="mt-4 space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex min-h-11 items-center justify-between rounded-xl border border-transparent px-3 transition-colors hover:border-primary/30 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <span className="font-medium">{link.label}</span>
                  <span className="font-mono text-sm text-text-muted transition-colors group-hover:text-primary">
                    {link.handle} &rarr;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
