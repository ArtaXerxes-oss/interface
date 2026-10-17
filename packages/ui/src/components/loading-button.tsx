import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"
import type { ComponentProps } from "react"

type LoadingButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean
  /** Label shown while `isLoading`. Defaults to the button's children. */
  loadingText?: React.ReactNode
}

/**
 * Button that owns its own pending presentation: disables itself, flags
 * `aria-busy` and swaps in a spinner. The spinner is `aria-hidden`, so the
 * accessible name is exactly `loadingText` (or the children).
 *
 * The spinner sits in a fixed-size slot that's always present (just hidden
 * via `invisible` when not loading), so entering the loading state never
 * changes the button's width.
 */
function LoadingButton({
  isLoading = false,
  loadingText,
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      data-slot="loading-button"
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn("gap-1.5", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-3 shrink-0 items-center justify-center",
          !isLoading && "invisible"
        )}
      >
        {isLoading && <Spinner />}
      </span>
      {isLoading ? (loadingText ?? children) : children}
    </Button>
  )
}

export { LoadingButton }
