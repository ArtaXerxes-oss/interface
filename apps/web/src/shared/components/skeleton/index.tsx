import { Skeleton } from "@workspace/ui/components/skeleton";

interface SkeletonProps {
  count?: number;
  className?: string;
}

export function TextSkeleton({ count = 1, className }: SkeletonProps) {
  if (count <= 0) return null;
  return (
    <div className={`space-y-2 ${className || ""}`} aria-busy="true" aria-label="Loading text">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 1, className }: SkeletonProps) {
  if (count <= 0) return null;
  return (
    <div className={`grid gap-4 ${className || ""}`} aria-busy="true" aria-label="Loading cards">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function TableSkeleton({ count = 1, className }: SkeletonProps) {
  if (count <= 0) return null;
  return (
    <div className={`w-full space-y-4 ${className || ""}`} aria-busy="true" aria-label="Loading table">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
