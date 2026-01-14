type UserEditFieldsProps = {
  username: string
  password: string
  isDisabled: boolean
  formError: string | null
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
}

export default function UserEditFields({
  username,
  password,
  isDisabled,
  formError,
  onUsernameChange,
  onPasswordChange,
}: UserEditFieldsProps) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        disabled={isDisabled}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        disabled={isDisabled}
        placeholder="New password"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
      {formError && <p className="text-xs text-amber-700">{formError}</p>}
    </div>
  )
}
