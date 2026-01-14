import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  bodyClassName?: string
}

export default function DashboardPanel({
  title,
  description,
  children,
  className,
  bodyClassName,
}: DashboardPanelProps) {
  const rootClasses = ['rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm', className]
    .filter(Boolean)
    .join(' ')
  const contentClasses = ['mt-4', bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClasses}>
      <div>
        <h2 className="font-[var(--font-display)] text-2xl text-[color:var(--ink)]">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{description}</p>
        )}
      </div>
      {children && <div className={contentClasses}>{children}</div>}
    </section>
  )
}
