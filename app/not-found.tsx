import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "cn"
import { Ghost } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const metadata: Metadata = {
  title: "NOT FOUND",
}

export default function NotFound({ className }: { className?: string }) {
  return (
    <Empty className={cn("min-h-screen border-none", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ghost />
        </EmptyMedia>
        <EmptyTitle>THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND</EmptyTitle>
        <EmptyDescription>This page does not exist.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/home">Go home</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
