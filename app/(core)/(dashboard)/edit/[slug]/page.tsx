import type { Metadata } from "next";
import { EditCard } from "@/components/edit-card";
import { getCardToEditBySlug } from "@/actions/card";
import { NotFoundUI } from "@/components/not-found-ui";
import { Ghost } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
  const param = await params;
  const { card, error } = await getCardToEditBySlug(param.slug);

  if (error || !card) {
    return (
      <NotFoundUI
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
