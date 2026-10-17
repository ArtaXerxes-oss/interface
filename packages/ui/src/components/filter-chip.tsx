import * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'

interface FilterChipProps {
  label: string
  onRemove: () => void
  className?: string
}

function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      data-slot="filter-chip"
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full border border-border bg-muted/60 px-2 text-10 font-medium text-muted-foreground',
        className,
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
        </svg>
      </button>
    </span>
  )
}

export { FilterChip }
export type { FilterChipProps }
