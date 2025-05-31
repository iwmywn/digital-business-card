import { getUserBySlug } from "@/lib/data";
import { UserProfileDisplay } from "@/components/user-profile-display";
import NotFound from "@/app/not-found";
import type { Metadata } from "next";
import { getCardByUserId } from "@/actions/card";
import { getCloudinaryUrl } from "@/lib/utils";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProfileSkeleton } from "@/components/skeletons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();

  const param = await params;
  const user = await getUserBySlug(param.slug);

  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user could not be found.",
    };
  }

  return {
    title: `${user.profile.fullName}'s Profile`,
    description:
      user.profile.bio ||
      `Explore ${user.profile.fullName}'s profile and contact information.`,
    openGraph: {
      images: [
        getCloudinaryUrl(
          user.profile.profileImage,
          user.profile.imageTransforms?.profile,
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
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent params={params} />
    </Suspense>
  );
}

async function UserProfileContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const param = await params;
  const user = await getUserBySlug(param.slug);

  if (!user) {
    return <NotFound />;
  }

  const dynamicSlugs = await getCardByUserId(user._id);

  return <UserProfileDisplay user={user} dynamicSlugs={dynamicSlugs} />;
}
