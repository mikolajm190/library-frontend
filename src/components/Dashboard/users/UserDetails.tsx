type UserDetailsProps = {
  username: string
  id: string
  role: string
}

export default function UserDetails({ username, id, role }: UserDetailsProps) {
  return (
    <>
      <p className="text-base font-semibold text-[color:var(--ink)]">{username}</p>
      <p className="text-xs text-[color:var(--ink-muted)]">{id}</p>
      <p className="text-xs text-[color:var(--ink-muted)]">Role: {role}</p>
    </>
  )
}
