import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { Ghost } from "lucide-react"

import { getCardToEditBySlug } from "@/actions/card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { EditCard } from "@/components/card/edit-card"
import { CreateCardSkeleton } from "@/components/skeletons"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  await connection()

  const param = await params
  const { card, error } = await getCardToEditBySlug(param.slug)

  if (error || !card) {
    return {
      title: "Card Not Found",
      description: "The requested digital business card could not be found.",
    }
  }

  return {
    title: "Edit Card",
    description: "Edit your digital business card.",
  }
}

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <Suspense fallback={<CreateCardSkeleton />}>
      <EditCardContent params={params} />
    </Suspense>
  )
}

async function EditCardContent({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await connection()

  const param = await params
  const { card, error } = await getCardToEditBySlug(param.slug)

  if (error || !card) {
    return (
      <Empty className="min-h-[calc(100vh-4.83rem)]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Ghost />
          </EmptyMedia>
          <EmptyTitle>OOPS! AN ERROR OCCURRED</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home">Go home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return <EditCard card={card} />
}
