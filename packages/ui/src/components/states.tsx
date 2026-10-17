import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Text } from "@workspace/ui/components/text"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Skeleton placeholder for a list or table body.
 *
 * Announces itself through an `sr-only` status message so screen-reader users
 * are told content is loading instead of hearing nothing.
 */
function LoadingState({
  rows = 3,
  label = "Loading…",
  rowClassName,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  rows?: number
  label?: string
  rowClassName?: string
}) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      aria-live="polite"
      className={cn("space-y-2 p-4", className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={cn("h-10 w-full", rowClassName)} />
      ))}
    </div>
  )
}

type EmptyStateProps = React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground/50">
          {icon}
        </div>
      )}
      <div>
        <Text size="base" weight="medium" tone="default">
          {title}
        </Text>
        {description && (
          <Text size="sm" tone="muted" className="mt-0.5">
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  )
}

type ErrorStateProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
        className
      )}
      {...props}
    >
      <div>
        <Text size="base" weight="medium" tone="danger">
          {title}
        </Text>
        {description && (
          <Text size="sm" tone="muted" className="mt-0.5">
            {description}
          </Text>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export { LoadingState, EmptyState, ErrorState }
