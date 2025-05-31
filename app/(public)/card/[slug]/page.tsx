import type { Metadata } from "next";
import { getCardToViewBySlug } from "@/actions/card";
import { CardView } from "@/components/card-view";
import NotFound from "@/app/not-found";
import { getCloudinaryUrl } from "@/lib/utils";
import { connection } from "next/server";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/skeletons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();

  const param = await params;
  const { card, error } = await getCardToViewBySlug(param.slug);

  if (error || !card) {
    return {
      title: "Card Not Found",
      description: "The requested digital business card could not be found.",
    };
  }

  return {
    title: `${card.personalInfo.fullName}'s Digital Business Card`,
    description:
      card.personalInfo.headline ||
      `Digital business card for ${card.personalInfo.fullName}`,
    openGraph: {
      images: [
        getCloudinaryUrl(
          card.cardDesign.profileImage,
          card.cardDesign.imageTransforms?.profile,
        ),
      ],
    },
  };
}

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="bg-primary-foreground flex min-h-screen items-center justify-center p-8">
          <CardSkeleton />
        </div>
      }
    >
      <ViewCardContent params={params} />
    </Suspense>
  );
}

async function ViewCardContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const param = await params;
  const { card, error } = await getCardToViewBySlug(param.slug);

  if (error || !card) {
    return <NotFound />;
  }

  return <CardView card={card} />;
}
