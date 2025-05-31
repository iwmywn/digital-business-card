import type { Metadata } from "next";
import { EditCard } from "@/components/edit-card";
import { getCardToEditBySlug } from "@/actions/card";
import { EmptyState } from "@/components/empty-state";
import { Ghost } from "lucide-react";
import { connection } from "next/server";

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

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const param = await params;
  const { card, error } = await getCardToEditBySlug(param.slug);

  if (error || !card) {
    return (
      <EmptyState
        icon={<Ghost />}
        title="OOPS! AN ERROR OCCURRED"
        message={error}
        linkHref="/home"
        linkLabel="Go home"
        className="min-h-[calc(100vh-4.83rem)]"
      />
    );
  }

  return <EditCard card={card} />;
}
