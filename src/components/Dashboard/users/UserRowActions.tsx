import { Pencil, Save, Trash2, X } from 'lucide-react'

type UserRowActionsProps = {
  isEditing: boolean
  isUpdating: boolean
  isDeleting: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}

export default function UserRowActions({
  isEditing,
  isUpdating,
  isDeleting,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: UserRowActionsProps) {
  const isDisabled = isUpdating || isDeleting

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[color:var(--ink)] px-3 py-1 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" aria-hidden />
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onEdit}
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </>
      )}
    </div>
  )
}
