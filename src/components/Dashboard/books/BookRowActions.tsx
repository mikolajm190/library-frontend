type BookRowActionsProps = {
  isEditing: boolean
  isUpdating: boolean
  isDeleting: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}

export default function BookRowActions({
  isEditing,
  isUpdating,
  isDeleting,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: BookRowActionsProps) {
  const isDisabled = isUpdating || isDeleting

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={isDisabled}
            className="rounded-full border border-black/10 bg-[color:var(--ink)] px-3 py-1 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onEdit}
            disabled={isDisabled}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDisabled}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </>
      )}
    </div>
  )
}
