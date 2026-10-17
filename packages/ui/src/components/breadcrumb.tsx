import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

// ── Breadcrumb ──

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /** Collapse to first + last when children exceed this count. */
  maxItems?: number
}

function Breadcrumb({ maxItems, label = "Breadcrumb", className, children, ...props }: BreadcrumbProps & { label?: string }) {
  const items = React.Children.toArray(children)
  const shouldCollapse = maxItems != null && items.length > maxItems

  return (
    <nav aria-label={label} data-slot="breadcrumb" className={cn("", className)} {...props}>
      <ol className="flex items-center gap-1.5 text-13 text-muted-foreground">
        {shouldCollapse ? (
          <>
            {items.slice(0, 1)}
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {items.slice(-1)}
          </>
        ) : (
          children
        )}
      </ol>
    </nav>
  )
}

// ── BreadcrumbItem ──

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {
  /** Marks this item as the current page. */
  isCurrent?: boolean
}

function BreadcrumbItem({ isCurrent, className, children, ...props }: BreadcrumbItemProps) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...(isCurrent ? { "aria-current": "page" as const } : {})}
      {...props}
    >
      {children}
    </li>
  )
}

// ── BreadcrumbLink ──

export interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  /** Render as <a> or <span>. Current-page links should use "span". */
  as?: "a" | "span"
}

function BreadcrumbLink({ as: Tag = "a", className, ...props }: BreadcrumbLinkProps) {
  return (
    <Tag
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors hover:text-foreground",
        Tag === "span" && "font-medium text-foreground",
        className,
      )}
      {...props}
    />
  )
}

// ── BreadcrumbSeparator ──

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-separator"
      className={cn("text-muted-foreground/40", className)}
      aria-hidden="true"
      {...props}
    >
      /
    </span>
  )
}

// ── BreadcrumbEllipsis ──

export interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {
  /** Accessible label for the ellipsis menu trigger. */
  label?: string
}

function BreadcrumbEllipsis({ label = "More pages", className, ...props }: BreadcrumbEllipsisProps) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn("flex size-5 items-center justify-center", className)}
      aria-label={label}
      role="button"
      tabIndex={0}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="13" cy="8" r="1.5" />
      </svg>
    </span>
  )
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbEllipsis }
