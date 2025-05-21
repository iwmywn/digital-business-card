import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Ghost } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "NOT FOUND",
};

export default function NotFound({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<Ghost />}
      title="THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND"
      message="This page does not exist."
      linkHref="/home"
      linkLabel="Go home"
      className={cn("min-h-screen border-none", className)}
    />
  );
}
