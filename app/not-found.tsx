import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Ghost } from "lucide-react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateDescription,
  EmptyStateAction,
} from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NOT FOUND",
};

export default function NotFound({ className }: { className?: string }) {
  return (
    <EmptyState className={cn("min-h-screen border-none", className)}>
      <EmptyStateIcon>
        <Ghost />
      </EmptyStateIcon>
      <EmptyStateHeader>
        THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
      </EmptyStateHeader>
      <EmptyStateDescription>This page does not exist.</EmptyStateDescription>
      <EmptyStateAction>
        <Button asChild>
          <Link href="/home">Go home</Link>
        </Button>
      </EmptyStateAction>
    </EmptyState>
  );
}
