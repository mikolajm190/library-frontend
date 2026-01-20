import { Search } from 'lucide-react'
import { useId } from 'react'

type PanelSearchProps = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  className?: string
  isDisabled?: boolean
}

export default function PanelSearch({
  value,
  onChange,
  label,
  placeholder,
  className,
  isDisabled = false,
}: PanelSearchProps) {
  const inputId = useId()
  const wrapperClassName = ['w-full', className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassName}>
      <label htmlFor={inputId} className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
        {label}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-muted)]"
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            className="w-full rounded-xl border border-black/10 bg-white px-9 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </label>
    </div>
  )
}
