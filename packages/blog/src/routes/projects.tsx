import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

const projects = [
  {
    title: '个人博客',
    description: '基于 Vite + React + TanStack Router 构建的个人博客网站',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    url: 'https://github.com/ccjr1120/ccjr1120.github.io',
  },
]

function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">项目</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
