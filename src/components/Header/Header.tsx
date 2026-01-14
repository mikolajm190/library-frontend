import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import HeaderActions from './HeaderActions'
import HeaderBrand from './HeaderBrand'

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
        <HeaderBrand />
        <HeaderActions isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      </div>
    </header>
  )
}
