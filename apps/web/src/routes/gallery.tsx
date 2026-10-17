import { createFileRoute } from "@tanstack/react-router"
import { GalleryPage } from "../features/gallery/components/gallery-page"

export const Route = createFileRoute("/gallery")({ component: GalleryPage })
