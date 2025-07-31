import type { Metadata } from "next"
import { Bug } from "lucide-react"

import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@/components/ui/empty-state"
import { BugReportDialog } from "@/components/support/bug-report-dialog"

export function generateMetadata(): Metadata {
  return { title: "Home" }
}

export default function page() {
  return (
    <EmptyState className="min-h-[calc(100vh-4.83rem)]">
      <EmptyStateIcon>
        <Bug />
      </EmptyStateIcon>
      <EmptyStateHeader>HELP IMPROVE THIS PROJECT</EmptyStateHeader>
      <EmptyStateDescription>
        Found a bug or have a suggestion? We appreciate your feedback to make
        this project better.
      </EmptyStateDescription>
      <EmptyStateAction>
        <BugReportDialog />
      </EmptyStateAction>
    </EmptyState>
  )
}
