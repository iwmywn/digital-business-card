import type { Metadata } from "next";
import { getCardBySlug } from "@/actions/card";
import { CardView } from "@/components/card-view";
import NotFound from "@/app/not-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await params;
  const { card, error } = await getCardBySlug(param.slug);

  if (error || !card) {
    return {
      title: "Card Not Found",
      description: "The requested digital business card could not be found.",
    };
  }

  return {
    title: card.personalInfo.fullName,
    description:
      card.personalInfo.headline ||
      `Digital business card for ${card.personalInfo.fullName}`,
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const param = await params;
  const { card, error } = await getCardBySlug(param.slug);

  if (error || !card) {
    return <NotFound className="min-h-[calc(100vh-4.83rem)]" />;
  }

  return <CardView card={card} />;
}
