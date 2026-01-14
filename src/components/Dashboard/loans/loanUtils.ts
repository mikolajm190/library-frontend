type DueStatus = {
  label: string
  badgeClassName: string
}

const getDaysLeft = (returnDate: Date) => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDate = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate())
  const diffMs = dueDate.getTime() - startOfToday.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const getDueStatus = (returnDate: Date): DueStatus => {
  const daysLeft = getDaysLeft(returnDate)
  if (daysLeft < 0) {
    const overdueDays = Math.abs(daysLeft)
    return {
      label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
      badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    }
  }
  if (daysLeft === 0) {
    return {
      label: 'Due today',
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }
  if (daysLeft <= 3) {
    return {
      label: `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }
  return {
    label: `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }
}
