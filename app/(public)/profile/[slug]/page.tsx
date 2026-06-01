import { Suspense } from "react"
import type { Metadata } from "next"
import { connection } from "next/server"
import { clientEnv } from "@/env/client"

import { getCardByUserId } from "@/actions/card"
import { UserProfileDisplay } from "@/components/settings/user-profile-display"
import { ProfileSkeleton } from "@/components/skeletons"
import { getUserBySlug } from "@/lib/data"
import { getPrimaryOgImage, parseFullName } from "@/lib/utils"
import NotFound from "@/app/not-found"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  await connection()

  const param = await params
  const user = await getUserBySlug(param.slug)

  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user could not be found.",
    }
  }

  const {
    jobTitle,
    company,
    bio,
    fullName,
    profileImage,
    coverImage,
    imageTransforms,
  } = user.profile
  const mainImage = getPrimaryOgImage({
    fullName,
    profileImage,
    coverImage,
    imageTransforms,
  })
  const { firstName, lastName } = parseFullName(fullName)
  const jobCompanyPart = jobTitle
    ? company
      ? `${jobTitle} at ${company}.`
      : `${jobTitle}.`
    : company
      ? `${company}.`
      : undefined
  const extraInfo =
    bio || `Explore ${fullName}'s profile and contact information.`

  return {
    title: `${fullName}'s Profile`,
    description: `${jobCompanyPart || ""} ${extraInfo}`.trim(),
    openGraph: {
      images: mainImage ? mainImage : [],
      url: `${clientEnv.NEXT_PUBLIC_URL}/profile/${param.slug}`,
      type: "profile",
      siteName: "Visiq",
      firstName,
      lastName,
    },
    twitter: {
      images: mainImage ? mainImage : [],
      site: "@Visiq",
    },
  }
}

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent params={params} />
    </Suspense>
  )
}

async function UserProfileContent({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await connection()

  const param = await params
  const user = await getUserBySlug(param.slug)

  if (!user) {
    return <NotFound />
  }

  const dynamicSlugs = await getCardByUserId(user._id)

  return <UserProfileDisplay user={user} dynamicSlugs={dynamicSlugs} />
}

export function generateStaticParams() {
  return [{ slug: "iwmywn" }]
}
