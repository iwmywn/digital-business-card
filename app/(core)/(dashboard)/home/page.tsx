import type { Metadata } from "next";
import { Bug } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { BugReportDialog } from "@/components/bug-report-dialog";

export function generateMetadata(): Metadata {
  return { title: "Home" };
}

export default function page() {
  return (
    <EmptyState
      icon={<Bug />}
      title="HELP IMPROVE THIS PROJECT"
      message="Found a bug or have a suggestion? We appreciate your feedback to make
        this project better."
      className="min-h-[calc(100vh-4.83rem)]"
    >
      <BugReportDialog />
    </EmptyState>
  );
}
