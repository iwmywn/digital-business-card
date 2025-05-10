import type { Metadata } from "next";
import { EditCard } from "@/components/edit-card";
import { getCardById } from "@/actions/card";
import NotFound from "@/app/not-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const param = await params;
  const { card, error } = await getCardById(param.id);

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
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const { card, error } = await getCardById(param.id);

  if (error || !card) {
    return <NotFound className="min-h-[calc(100vh-4.83rem)]" />;
  }

  return <EditCard card={card} />;
}
