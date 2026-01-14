type UserDetailsProps = {
  username: string
  id: string
}

export default function UserDetails({ username, id }: UserDetailsProps) {
  return (
    <>
      <p className="text-base font-semibold text-[color:var(--ink)]">{username}</p>
      <p className="text-xs text-[color:var(--ink-muted)]">{id}</p>
    </>
  )
}
