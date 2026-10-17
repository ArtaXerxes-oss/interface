import { cva } from "class-variance-authority"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const tokenAvatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden ring-1 ring-border",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-6",
        md: "size-8",
        lg: "size-10",
        xl: "size-12",
        "2xl": "size-16",
      },
      variant: {
        solid: "",
        outline: "ring-2",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "solid",
    },
  }
)

type TokenAvatarProps = {
  symbol: string
  src?: string
  size?: VariantProps<typeof tokenAvatarVariants>["size"]
  variant?: VariantProps<typeof tokenAvatarVariants>["variant"]
  className?: string
  aria?: "img" | "presentation"
}

function getInitials(symbol: string): string {
  return symbol.toUpperCase().slice(0, 2)
}

function getColorForSymbol(symbol: string): string {
  const colors: Record<string, string> = {
    BTC: "bg-orange-500/15 text-orange-400",
    ETH: "bg-indigo-500/15 text-indigo-400",
    XLM: "bg-sky-500/15 text-sky-400",
    USDC: "bg-blue-500/15 text-blue-400",
    USDT: "bg-red-500/15 text-red-400",
    SOL: "bg-purple-500/15 text-purple-400",
    BNB: "bg-yellow-500/15 text-yellow-400",
    GLV: "bg-teal-500/15 text-teal-400",
  }
  return colors[symbol.toUpperCase()] ?? "bg-muted/60 text-muted-foreground"
}

export function TokenAvatar({
  symbol,
  src,
  size = "md",
  variant = "solid",
  className,
  aria = "img",
}: TokenAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const showImage = !!src && !imageError
  const colorClasses = getColorForSymbol(symbol)

  const sizeMap: Record<string, number> = {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    "2xl": 64,
  }

  const fontSize = sizeMap[size ?? "md"] * 0.35

  return (
    <div
      role={aria === "presentation" ? "presentation" : "img"}
      aria-label={aria === "img" ? `${symbol} token` : undefined}
      className={cn(tokenAvatarVariants({ size, variant }), colorClasses, className)}
    >
      {showImage ? (
        <img
          src={src}
          alt={aria === "img" ? `${symbol} icon` : ""}
          className="h-full w-full object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-semibold leading-none" style={{ fontSize }}>
          {getInitials(symbol)}
        </span>
      )}
    </div>
  )
}

export function TokenPair({
  symbol1,
  symbol2,
  src1,
  src2,
  size = "md",
  className,
}: {
  symbol1: string
  symbol2: string
  src1?: string
  src2?: string
  size?: VariantProps<typeof tokenAvatarVariants>["size"]
  className?: string
}) {
  const sizeMap: Record<string, number> = {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    "2xl": 64,
  }

  const containerSize = sizeMap[size ?? "md"]
  const secondTokenOffset = containerSize * 0.35

  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: containerSize + secondTokenOffset * 0.8, height: containerSize }}
      role="img"
      aria-label={`${symbol1} and ${symbol2} token pair`}
    >
      <div>
        <TokenAvatar symbol={symbol1} src={src1} size={size} aria="presentation" />
      </div>
      <div style={{ marginLeft: -secondTokenOffset }}>
        <TokenAvatar symbol={symbol2} src={src2} size={size} aria="presentation" />
      </div>
    </div>
  )
}
