type BookDetailsProps = {
  title: string
  author: string
}

export default function BookDetails({ title, author }: BookDetailsProps) {
  return (
    <>
      <p className="text-base font-semibold text-[color:var(--ink)]">{title}</p>
      <p className="text-xs text-[color:var(--ink-muted)]">{author}</p>
    </>
  )
}
