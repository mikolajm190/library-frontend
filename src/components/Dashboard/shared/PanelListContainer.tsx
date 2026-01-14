import type { ReactNode } from 'react'

type PanelListContainerProps = {
  children: ReactNode
  className?: string
}

export default function PanelListContainer({ children, className }: PanelListContainerProps) {
  const containerClassName = [
    'mt-4 max-h-[420px] overflow-y-auto pr-2 lg:flex-1 lg:min-h-0 lg:max-h-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={containerClassName}>{children}</div>
}
