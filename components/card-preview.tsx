"use client";

import Image from "next/image";
import type { CardDesignValues } from "@/components/card-design";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { SerializableLinkType } from "@/components/icons";
import { QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkTypes } from "@/components/icons";
import { getColorClass, getFontClass } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getCloudinaryUrl } from "@/lib/utils";

interface CardPreviewProps {
  cardDesign: CardDesignValues;
  personalInfo: PersonalInfoValues;
  links: SerializableLinkType[];
  size?: "small" | "large";
}

export function CardPreview({
  cardDesign,
  personalInfo,
  links,
  size = "large",
}: CardPreviewProps) {
  const isSmall = size === "small";
  const colorClass = getColorClass(cardDesign.cardColor);
  const fontClass = getFontClass(cardDesign.fontFamily);

  const getImageUrl = (type: "logo" | "profile" | "cover") => {
    const transform = cardDesign.imageTransforms?.[type];

    let imageUrl;

    if (type === "logo") imageUrl = cardDesign.logoImage;
    if (type === "profile") imageUrl = cardDesign.profileImage;
    if (type === "cover") imageUrl = cardDesign.coverImage;

    return getCloudinaryUrl(imageUrl, transform);
  };

  const getIconComponent = (linkType: string) => {
    const foundLinkType = linkTypes.find((lt) => lt.type === linkType);
    if (foundLinkType) {
      const IconComponent = foundLinkType.icon;
      return <IconComponent className="h-6 w-6" />;
    }
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className={`overflow-hidden rounded-xl shadow-sm ${fontClass}`}>
        <div className={`relative aspect-2/1 ${colorClass}`}>
          {cardDesign.coverImage ? (
            <div className="relative h-full w-full overflow-hidden">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getImageUrl("cover")}
                  alt="Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ) : (
            <div
              className={`flex h-full items-center justify-center p-6 text-white`}
            >
              {cardDesign.logoImage && (
                <div className="h-20 w-20 overflow-hidden rounded-lg shadow-md">
                  <div className="pointer-events-none relative h-full w-full select-none">
                    <Image
                      src={getImageUrl("logo")}
                      alt="Logo"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative space-y-4 bg-white p-6">
          {cardDesign.profileImage && (
            <div className="absolute top-[-3.125rem] left-6 h-25 w-25 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getImageUrl("profile")}
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {cardDesign.logoImage && cardDesign.coverImage && (
            <div className="absolute -top-8 right-6 h-16 w-16 overflow-hidden rounded-lg border-2 border-white shadow-md">
              <div className="pointer-events-none relative h-full w-full select-none">
                <Image
                  src={getImageUrl("logo")}
                  alt="Logo"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {cardDesign.profileImage && <div className="mt-10" />}

          <div className="w-full space-y-1">
            <h2 className="text-[1.75rem] leading-snug font-bold wrap-anywhere text-black">
              {personalInfo.fullName || "Full Name"}
            </h2>
            <p className="text-xl leading-tight font-semibold wrap-anywhere text-gray-800">
              {personalInfo.jobTitle || "Job Title"}
            </p>
            <p className="text-lg leading-tight font-medium wrap-anywhere text-gray-700">
              {personalInfo.department || "Department"}
            </p>
            <p className="text-base wrap-anywhere text-gray-500">
              {personalInfo.company || "Company Name"}
            </p>
            <p className="text-base wrap-anywhere text-gray-400 italic">
              {personalInfo.accreditations || "Accreditations"}
            </p>
          </div>

          <Separator className="bg-black/15" />

          <p className="text-base leading-snug wrap-anywhere text-gray-700 italic">
            {personalInfo.headline ||
              "A brief headline about who you are – your role, passion, or goal."}
          </p>

          <Separator className="bg-black/15" />

          <p className="text-base leading-relaxed wrap-anywhere text-gray-600">
            {personalInfo.bio ||
              "Tell a little about yourself: your background, experience, or what makes you unique."}
          </p>

          {links.length > 0 && (
            <>
              <Separator className="bg-black/15" />
              <div className="space-y-2">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 text-base"
                  >
                    <div
                      className={`${colorClass} flex items-center justify-center rounded-full p-2 text-white`}
                    >
                      {getIconComponent(link.type)}
                    </div>
                    <div className="w-[calc(100%-3.25rem)] flex-1">
                      <span className="font-medium text-gray-800">
                        {link.label || link.type}
                      </span>
                      {link.value && (
                        <p className="truncate text-sm text-gray-600">
                          {link.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div
          className={`${colorClass} flex items-center justify-between gap-4 p-3`}
        >
          <span className={`text-xs wrap-anywhere text-white opacity-80`}>
            {cardDesign.brandName}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <QrCode className="h-4 w-4" />
              <span className="sr-only">Show QR code</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share link</span>
            </Button>
          </div>
        </div>
      </div>

      {!isSmall && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Preview shows how your card will appear to others</p>
        </div>
      )}
    </div>
  );
}
