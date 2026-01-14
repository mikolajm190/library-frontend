import { Link } from 'react-router-dom'

export default function HeaderBrand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
        Lantern Library
      </span>
    </Link>
  )
}
