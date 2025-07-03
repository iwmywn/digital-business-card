import type { Metadata } from "next";
import { EditCard } from "@/components/card/edit-card";
import { getCardToEditBySlug } from "@/actions/card";
import { Ghost } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { CreateCardSkeleton } from "@/components/skeletons";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateDescription,
  EmptyStateAction,
} from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();

  const param = await params;
  const { card, error } = await getCardToEditBySlug(param.slug);

  if (error || !card) {
    return {
      title: "Card Not Found",
      description: "The requested digital business card could not be found.",
    };
  }

  return {
    title: "Edit Card",
    description: "Edit your digital business card.",
  };
}

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CreateCardSkeleton />}>
      <EditCardContent params={params} />
    </Suspense>
  );
}

async function EditCardContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const param = await params;
  const { card, error } = await getCardToEditBySlug(param.slug);

  if (error || !card) {
    return (
      <EmptyState className="min-h-[calc(100vh-4.83rem)]">
        <EmptyStateIcon>
          <Ghost />
        </EmptyStateIcon>
        <EmptyStateHeader>OOPS! AN ERROR OCCURRED</EmptyStateHeader>
        <EmptyStateDescription>{error}</EmptyStateDescription>
        <EmptyStateAction>
          <Button asChild>
            <Link href="/home">Go home</Link>
          </Button>
        </EmptyStateAction>
      </EmptyState>
    );
  }

  return <EditCard card={card} />;
}
