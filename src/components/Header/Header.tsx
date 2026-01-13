import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="w-full border-b border-black/10">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
            Lantern Library
          </span>
        </Link>

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
                onClick={handleLogout}
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
      </div>
    </header>
  )
}
