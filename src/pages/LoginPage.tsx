import { useState } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { login } from '../api/auth.api'
import { getApiErrorMessage } from '../api/apiError'
import PageShell from '../components/Layout/PageShell'
import LoginForm, { type LoginFormValues } from '../components/Login/LoginForm'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'
  const { login: storeToken } = useAuth()

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const { token } = await login(values)
      storeToken(token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell>
      <section className="mx-auto mt-14 flex w-full max-w-6xl justify-center">
        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
      </section>
    </PageShell>
  )
}
