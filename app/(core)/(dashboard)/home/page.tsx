import type { Metadata } from "next"
import { Bug } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { BugReportDialog } from "@/components/support/bug-report-dialog"

export function generateMetadata(): Metadata {
  return { title: "Home" }
}

export default function page() {
  return (
    <Empty className="min-h-[calc(100vh-4.83rem)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bug />
        </EmptyMedia>
        <EmptyTitle>HELP IMPROVE THIS PROJECT</EmptyTitle>
        <EmptyDescription>
          Found a bug or have a suggestion? We appreciate your feedback to make
          this project better.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <BugReportDialog />
      </EmptyContent>
    </Empty>
  )
}
