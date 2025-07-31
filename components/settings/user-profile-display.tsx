import Image from "next/image"
import { differenceInDays, format } from "date-fns"
import {
  Briefcase,
  Building,
  CalendarDays,
  Globe,
  Mars,
  NonBinary,
  Venus,
} from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FormLink } from "@/components/form-link"
import type { User } from "@/lib/definitions"
import { formatDate, getCloudinaryUrl } from "@/lib/utils"

export function UserProfileDisplay({
  user,
  dynamicSlugs,
}: {
  user: Pick<User, "profile" | "createdAt">
  dynamicSlugs:
    | string[]
    | {
        error: string
      }
}) {
  const { profile, createdAt } = user
  const joinedDate = new Date(createdAt)
  const daysJoined = differenceInDays(new Date(), joinedDate)
  const joinedFormatted = `Joined ${format(joinedDate, "d MMM yyyy")}`

  const renderGenderIcon = () => {
    switch (profile.gender?.toLowerCase()) {
      case "male":
        return <Mars className="size-4 text-blue-500" />
      case "female":
        return <Venus className="size-4 text-pink-500" />
      case "non-binary":
        return <NonBinary className="size-4 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-xl overflow-hidden rounded-lg border-none pt-0">
        <div className="bg-foreground/15 aspect-2/1">
          {profile.coverImage && (
            <div className="relative h-full w-full overflow-hidden">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getCloudinaryUrl(
                    profile.coverImage,
                    profile.imageTransforms?.cover
                  )}
                  alt="Cover photo"
                  fill
                  sizes="576px"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}
        </div>

        <CardHeader className="relative pt-0 pb-0">
          <div className="-mt-16 flex flex-col items-center md:-mt-20">
            <div className="border-background h-32 w-32 overflow-hidden rounded-full border-4 shadow-sm md:h-40 md:w-40">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getCloudinaryUrl(
                    profile.profileImage,
                    profile.imageTransforms?.profile
                  )}
                  alt="Profile picture"
                  fill
                  sizes="128px"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {profile.fullName}
                </h1>
                {renderGenderIcon()}
              </div>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                      <CalendarDays className="size-[0.875rem]" />
                      <span>{joinedFormatted}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    {daysJoined} days ago
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {profile.bio && (
            <div>
              <h2 className="mb-2 text-base font-semibold sm:text-lg">About</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {profile.bio}
              </p>
            </div>
          )}

          {Array.isArray(dynamicSlugs) && dynamicSlugs.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-base font-semibold sm:text-lg">
                My Digital Business Cards
              </h2>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                {dynamicSlugs.map((slug) => (
                  <li key={slug} className="truncate">
                    <FormLink
                      href={`/card/${slug}`}
                      target="_blank"
                      className="text-sm sm:text-base"
                    >
                      {`${process.env.NEXT_PUBLIC_URL}/card/${slug}`}
                    </FormLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(profile.bio ||
            (Array.isArray(dynamicSlugs) &&
              dynamicSlugs.length > 0 &&
              (profile.jobTitle ||
                profile.company ||
                profile.website ||
                profile.dateOfBirth))) && <Separator />}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.jobTitle && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
                  <Briefcase className="text-primary size-4 sm:size-5" />
                </div>
                <div className="text-sm sm:text-base">
                  <p className="font-medium">Profession</p>
                  <p className="text-muted-foreground">
                    {profile.jobTitle || "Not specified"}
                  </p>
                </div>
              </div>
            )}

            {profile.company && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
                  <Building className="text-primary size-4 sm:size-5" />
                </div>
                <div className="text-sm sm:text-base">
                  <p className="font-medium">Company</p>
                  <p className="text-muted-foreground">{profile.company}</p>
                </div>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
                  <Globe className="text-primary size-4 sm:size-5" />
                </div>
                <div className="text-sm sm:text-base">
                  <p className="font-medium">Website</p>
                  <FormLink
                    href={
                      profile.website.startsWith("http")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground sm:text-base"
                  >
                    {profile.website}
                  </FormLink>
                </div>
              </div>
            )}

            {profile.dateOfBirth && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
                  <CalendarDays className="text-primary size-4 sm:size-5" />
                </div>
                <div className="text-sm sm:text-base">
                  <p className="font-medium">Birthday</p>
                  <p className="text-muted-foreground">
                    {formatDate(profile.dateOfBirth)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
