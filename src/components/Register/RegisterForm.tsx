import { useState, type ChangeEvent, type FormEvent } from 'react'
import AuthField from '../Auth/AuthField'
import AuthFormShell from '../Auth/AuthFormShell'

export type RegisterFormValues = {
  username: string
  password: string
  confirmPassword: string
}

type RegisterFormProps = {
  onSubmit?: (values: RegisterFormValues) => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

export default function RegisterForm({ onSubmit, isSubmitting = false, error }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange =
    (field: keyof RegisterFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      if (validationError) {
        setValidationError(null)
      }
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    if (values.password !== values.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    onSubmit?.(values)
  }

  const messages = [validationError, error].filter(Boolean) as string[]

  return (
    <AuthFormShell
      title="Register"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Register"
      messages={messages.length > 0 ? messages : undefined}
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
        autoComplete="new-password"
        disabled={isSubmitting}
      />
      <AuthField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        autoComplete="new-password"
        disabled={isSubmitting}
      />
    </AuthFormShell>
  )
}
