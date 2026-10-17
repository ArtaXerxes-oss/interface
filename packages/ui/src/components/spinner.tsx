import { cn } from "@workspace/ui/lib/utils"

type SpinnerProps = React.ComponentProps<"span"> & {
  /**
   * Accessible label. Omit when the spinner sits inside a control that already
   * announces its busy state (e.g. `LoadingButton`) so the button keeps its
   * own accessible name.
   */
  label?: string
}

function Spinner({ className, label, ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      {...(label
        ? { role: "status", "aria-label": label }
        : { "aria-hidden": true })}
      className={cn(
        "inline-block size-3 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none motion-reduce:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
