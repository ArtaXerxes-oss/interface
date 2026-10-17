import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useCopy } from "../../hooks/use-copy"

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

type Props = {
  code: string
  label?: string
  onEdit?: () => void
  className?: string
}

export function CodeDisplay({ code, label = "Active referral code", onEdit, className }: Props) {
  const { copy, copied } = useCopy("Referral code copied!")

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <p className="mb-3 text-11 font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <div className="flex items-center gap-2">
        {/* Code pill */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
          <span className="truncate font-mono text-15 font-bold tracking-widest text-foreground">
            {code}
          </span>
          <button
            onClick={() => copy(code)}
            aria-label="Copy code"
            className={cn(
              "shrink-0 rounded p-0.5 transition-colors",
              copied
                ? "text-green-400"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <CopyIcon copied={copied} />
          </button>
        </div>

        {onEdit && (
          <Button variant="outline" size="lg" className="shrink-0" onClick={onEdit}>
            <EditIcon />
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}
