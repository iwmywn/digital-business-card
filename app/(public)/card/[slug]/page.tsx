import type { Metadata } from "next";
import { getCardToViewBySlug } from "@/actions/card";
import { CardView } from "@/components/card-view";
import NotFound from "@/app/not-found";
import { getPrimaryOgImage, parseFullName } from "@/lib/utils";
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

  const { profileImage, logoImage, coverImage, imageTransforms } =
    card.cardDesign;
  const { jobTitle, company, headline, bio, fullName } = card.personalInfo;
  const mainImage = getPrimaryOgImage({
    fullName,
    profileImage,
    logoImage,
    coverImage,
    imageTransforms,
  });
  const { firstName, lastName } = parseFullName(fullName);
  const jobCompanyPart = jobTitle
    ? company
      ? `${jobTitle} at ${company}.`
      : `${jobTitle}.`
    : company
      ? `${company}.`
      : undefined;
  const extraInfo = headline || bio || `Digital business card for ${fullName}.`;

  return {
    title: `${fullName}'s Digital Business Card`,
    description: `${jobCompanyPart || ""} ${extraInfo}`.trim(),
    openGraph: {
      images: mainImage ? mainImage : [],
      url: `${process.env.NEXT_PUBLIC_URL}/card/${param.slug}`,
      type: "profile",
      siteName: "Visiq",
      firstName,
      lastName,
    },
    twitter: {
      images: mainImage ? mainImage : [],
      site: "@Visiq",
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

export function generateStaticParams() {
  return [{ slug: "iwmywn" }];
}
