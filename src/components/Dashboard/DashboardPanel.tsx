import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  description?: string
  children?: ReactNode
}

export default function DashboardPanel({ title, description, children }: DashboardPanelProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
      <div>
        <h2 className="font-[var(--font-display)] text-2xl text-[color:var(--ink)]">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{description}</p>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  )
}
