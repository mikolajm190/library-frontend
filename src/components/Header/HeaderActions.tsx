import { LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react'
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
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Dashboard
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow hover:cursor-pointer"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Register
          </Link>
        </>
      )}
    </div>
  )
}
