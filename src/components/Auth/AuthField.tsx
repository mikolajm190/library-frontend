import type { ChangeEvent } from 'react'

type AuthFieldProps = {
  label: string
  name: string
  type: 'text' | 'password'
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  autoComplete: string
  disabled?: boolean
  placeholder?: string
}

export default function AuthField({
  label,
  name,
  type,
  value,
  onChange,
  autoComplete,
  disabled = false,
  placeholder,
}: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)]">
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        disabled={disabled}
        placeholder={placeholder}
        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-base text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
    </label>
  )
}
