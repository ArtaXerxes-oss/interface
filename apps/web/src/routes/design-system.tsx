import { createFileRoute } from "@tanstack/react-router"
import { DesignSystemPage } from "@/features/design-system/design-system-page"

export const Route = createFileRoute("/design-system")({
  component: () => {
    if (import.meta.env.PROD) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Design system gallery is only available in development.</p>
        </div>
      )
    }
    return <DesignSystemPage />
  },
})
