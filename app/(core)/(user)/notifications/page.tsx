import type { Metadata } from "next"
import { BellOff } from "lucide-react"

import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "View updates, alerts, and important messages related to your digital business card.",
}

export default function page() {
  return (
    <EmptyState className="min-h-[calc(100vh-4.83rem)]">
      <EmptyStateIcon>
        <BellOff />
      </EmptyStateIcon>
      <EmptyStateHeader>NO NOTIFICATIONS (WIP)</EmptyStateHeader>
      <EmptyStateDescription>
        You&apos;re all caught up! There are no new notifications at the moment.
      </EmptyStateDescription>
    </EmptyState>
  )
}
