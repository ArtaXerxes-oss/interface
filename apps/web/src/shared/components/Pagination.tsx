type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const page =
    totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : 0
  const hasPrevious = page > 1
  const hasNext = page > 0 && page < totalPages

  return (
    <nav aria-label="Pagination" className="flex items-center gap-3">
      <button
        type="button"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}
