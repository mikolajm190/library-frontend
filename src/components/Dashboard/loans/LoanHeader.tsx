type LoanHeaderProps = {
  title: string
  author: string
}

export default function LoanHeader({ title, author }: LoanHeaderProps) {
  return (
    <div>
      <p className="text-base font-semibold text-[color:var(--ink)]">{title}</p>
      <p className="text-xs text-[color:var(--ink-muted)]">{author}</p>
    </div>
  )
}
