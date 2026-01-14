import { Link } from 'react-router-dom'

type HeaderActionsProps = {
  isAuthenticated: boolean
  onLogout: () => void
}

export default function HeaderActions({ isAuthenticated, onLogout }: HeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow hover:cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Register
          </Link>
        </>
      )}
    </div>
  )
}
