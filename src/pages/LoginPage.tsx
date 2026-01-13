import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../api/auth.api'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import LoginForm, { type LoginFormValues } from '../components/Login/LoginForm'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const { token } = await login(values)
      localStorage.setItem('authToken', token)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | string | undefined
        if (typeof responseData === 'string') {
          setError(responseData)
        } else {
          setError(responseData?.message ?? 'Login failed.')
        }
        return
      }
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />

      <section className="mx-auto mt-14 flex w-full max-w-6xl justify-center">
        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
      </section>

      <Footer />
    </main>
  )
}
