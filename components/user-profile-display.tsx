import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { differenceInDays, format } from "date-fns";
import {
  Mars,
  Venus,
  CalendarDays,
  Briefcase,
  Building,
  Globe,
  NonBinary,
} from "lucide-react";
import { formatDate, getCloudinaryUrl } from "@/lib/utils";
import type { User } from "@/lib/definitions";
import { FormLink } from "@/components/form-link";
import Image from "next/image";

export function UserProfileDisplay({
  user,
  dynamicSlugs,
}: {
  user: Pick<User, "profile" | "createdAt">;
  dynamicSlugs:
    | string[]
    | {
        error: string;
      };
}) {
  const { profile, createdAt } = user;
  const joinedDate = new Date(createdAt);
  const daysJoined = differenceInDays(new Date(), joinedDate);
  const joinedFormatted = `Joined ${format(joinedDate, "d MMM yyyy")}`;

  const renderGenderIcon = () => {
    switch (profile.gender?.toLowerCase()) {
      case "male":
        return <Mars className="h-4 w-4 text-blue-500" />;
      case "female":
        return <Venus className="h-4 w-4 text-pink-500" />;
      case "non-binary":
        return <NonBinary className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-xl overflow-hidden rounded-lg border-none pt-0">
        <div className="bg-foreground/40 aspect-2/1">
          {profile.coverImage && (
            <div className="relative h-full w-full overflow-hidden">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getCloudinaryUrl(
                    profile.coverImage,
                    profile.imageTransforms?.cover,
                  )}
                  alt="Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}
        </div>

        <CardHeader className="relative pt-0 pb-0">
          <div className="-mt-16 flex flex-col items-center md:-mt-20">
            <Avatar className="border-background pointer-events-none h-32 w-32 border-4 shadow-md md:h-40 md:w-40">
              <AvatarImage
                src={getCloudinaryUrl(
                  profile.profileImage,
                  profile.imageTransforms?.profile,
                )}
                alt={profile.fullName}
              />
              <AvatarFallback className="text-3xl md:text-4xl">
                {profile.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>

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
                    <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1.5 text-sm">
                      <CalendarDays size={14} />
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
              <h2 className="mb-2 text-lg font-semibold">About</h2>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
          )}

          {Array.isArray(dynamicSlugs) && dynamicSlugs.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold">
                My Digital Business Cards
              </h2>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                {dynamicSlugs.map((slug) => (
                  <li key={slug} className="truncate">
                    <FormLink
                      href={`${process.env.NEXT_PUBLIC_URL}/card/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base"
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
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Briefcase className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Profession</p>
                  <p className="text-muted-foreground text-sm">
                    {profile.jobTitle || "Not specified"}
                  </p>
                </div>
              </div>
            )}

            {profile.company && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Building className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Company</p>
                  <p className="text-muted-foreground text-sm">
                    {profile.company}
                  </p>
                </div>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Globe className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <FormLink
                    href={
                      profile.website.startsWith("http")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm"
                  >
                    {profile.website}
                  </FormLink>
                </div>
              </div>
            )}

            {profile.dateOfBirth && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <CalendarDays className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Birthday</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(profile.dateOfBirth)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
