import type { Metadata } from "next"
import { BellOff } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "View updates, alerts, and important messages related to your digital business card.",
}

export default function page() {
  return (
    <Empty className="min-h-[calc(100vh-4.83rem)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellOff />
        </EmptyMedia>
        <EmptyTitle>NO NOTIFICATIONS (WIP)</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up! There are no new notifications at the
          moment.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
