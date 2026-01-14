import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  bodyClassName?: string
  icon?: ReactNode
}

export default function DashboardPanel({
  title,
  description,
  children,
  className,
  bodyClassName,
  icon,
}: DashboardPanelProps) {
  const rootClasses = ['rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm', className]
    .filter(Boolean)
    .join(' ')
  const contentClasses = ['mt-4', bodyClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClasses}>
      <div>
        <div className="flex items-center gap-3">
          {icon && <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/5">{icon}</span>}
          <h2 className="font-[var(--font-display)] text-2xl text-[color:var(--ink)]">
            {title}
          </h2>
        </div>
        {description && (
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{description}</p>
        )}
      </div>
      {children && <div className={contentClasses}>{children}</div>}
    </section>
  )
}
