type BookEditFieldsProps = {
  title: string
  author: string
  isDisabled: boolean
  onTitleChange: (value: string) => void
  onAuthorChange: (value: string) => void
}

export default function BookEditFields({
  title,
  author,
  isDisabled,
  onTitleChange,
  onAuthorChange,
}: BookEditFieldsProps) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        disabled={isDisabled}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
      <input
        type="text"
        value={author}
        onChange={(event) => onAuthorChange(event.target.value)}
        disabled={isDisabled}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
      />
    </div>
  )
}
