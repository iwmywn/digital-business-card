import { getUserBySlug } from "@/lib/data";
import { UserProfileDisplay } from "@/components/user-profile-display";
import NotFound from "@/app/not-found";
import type { Metadata } from "next";
import { getCardByUserId } from "@/actions/card";
import { getCloudinaryUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await params;
  const user = await getUserBySlug(param.slug);

  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user could not be found.",
    };
  }

  return {
    title: user.profile.fullName,
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

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const param = await params;
  const user = await getUserBySlug(param.slug);

  if (!user) {
    return <NotFound />;
  }

  const dynamicSlugs = await getCardByUserId(user._id);

  return <UserProfileDisplay user={user} dynamicSlugs={dynamicSlugs} />;
}
