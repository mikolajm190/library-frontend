import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { register } from '../api/auth.api'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import RegisterForm, { type RegisterFormValues } from '../components/Register/RegisterForm'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const { token } = await register({ username: values.username, password: values.password })
      localStorage.setItem('authToken', token)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | string | undefined
        if (typeof responseData === 'string') {
          setError(responseData)
        } else {
          setError(responseData?.message ?? 'Registration failed.')
        }
        return
      }
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />

      <section className="mx-auto mt-14 flex w-full max-w-6xl justify-center">
        <RegisterForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
      </section>

      <Footer />
    </main>
  )
}
