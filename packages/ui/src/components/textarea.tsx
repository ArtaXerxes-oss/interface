import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@workspace/ui/lib/utils"

type TextareaResize = "none" | "vertical"

interface TextareaProps extends Omit<React.ComponentProps<"textarea">, "children"> {
  /** Whether the user can resize the textarea. Defaults to vertical-only, matching native behavior. */
  resize?: TextareaResize
}

function Textarea({ className, resize = "vertical", rows = 3, ...props }: TextareaProps) {
  return (
    <FieldPrimitive.Control
      render={<textarea rows={rows} />}
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        resize === "none" ? "resize-none" : "resize-y",
        className
      )}
      // Field.Control's props are typed against <input>; passing it off as a
      // <textarea> via `render` is a supported Base UI pattern (see the
      // Field.Control docs), but its own types don't model that yet.
      {...(props as React.ComponentProps<typeof FieldPrimitive.Control>)}
    />
  )
}

export { Textarea }
export type { TextareaProps, TextareaResize }
