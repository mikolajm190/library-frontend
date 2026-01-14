import { useState, type ChangeEvent, type FormEvent } from 'react'
import AuthField from '../Auth/AuthField'
import AuthFormShell from '../Auth/AuthFormShell'

export type LoginFormValues = {
  username: string
  password: string
}

type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

export default function LoginForm({ onSubmit, isSubmitting = false, error }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })

  const handleChange = (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    onSubmit?.(values)
  }

  return (
    <AuthFormShell
      title="Login"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Login"
      messages={error ? [error] : undefined}
    >
      <AuthField
        label="Username"
        name="username"
        type="text"
        value={values.username}
        onChange={handleChange('username')}
        autoComplete="username"
        disabled={isSubmitting}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange('password')}
        autoComplete="current-password"
        disabled={isSubmitting}
      />
    </AuthFormShell>
  )
}
