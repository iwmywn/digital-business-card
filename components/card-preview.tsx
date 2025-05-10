"use client";

import type React from "react";
import Image from "next/image";
import type { CardDesignValues } from "@/components/card-design";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { SerializableLinkType } from "@/components/icons";
import { QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkTypes } from "@/components/icons";
import { getColorClass, getFontClass } from "@/lib/utils";
import { Separator } from "@/components/separator";

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
    if (transform?.croppedImageUrl) {
      return transform.croppedImageUrl;
    }

    if (type === "logo") return cardDesign.logoImage;
    if (type === "profile") return cardDesign.profileImage;
    return cardDesign.coverImage;
  };

  const getIconComponent = (linkType: string) => {
    const foundLinkType = linkTypes.find((lt) => lt.type === linkType);
    if (foundLinkType) {
      const IconComponent = foundLinkType.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        className={`overflow-hidden rounded-xl border border-gray-200 shadow-lg ${fontClass && fontClass}`}
      >
        <div className={`relative ${colorClass}`}>
          {cardDesign.coverImage ? (
            <div className="relative h-48 w-full overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl("cover") || "/placeholder.svg"}
                  alt="Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {cardDesign.logoImage && (
                <div className="absolute right-4 bottom-4 h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-md">
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl("logo") || "/placeholder.svg"}
                      alt="Logo"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`flex h-32 items-center justify-center p-6 text-white`}
            >
              {cardDesign.logoImage && (
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-white p-1 shadow-md">
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl("logo") || "/placeholder.svg"}
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

        <div className="space-y-4 bg-white p-6">
          <div className="flex items-start gap-4">
            {cardDesign.profileImage && (
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl("profile") || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <h2 className="font-bold">
                <span className="text-xl text-black">
                  {personalInfo.fullName || "Full Name"}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {personalInfo.accreditations || "Accreditations"}
                </span>
              </h2>
              <p className="font-medium">
                <span className="text-gray-700">
                  {personalInfo.jobTitle || "Job Title"}
                </span>
                <span className="text-gray-500">
                  , {personalInfo.department || "Department"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {personalInfo.company || "Company Name"}
              </p>
            </div>
          </div>

          <Separator className="bg-black/15" />

          <p className="text-gray-700 italic">
            {personalInfo.headline ||
              "A brief headline about who you are – your role, passion, or goal."}
          </p>

          <Separator className="bg-black/15" />

          <p className="text-sm text-gray-600">
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
                    className="flex items-center gap-3 text-sm"
                  >
                    <div
                      className={`${colorClass} rounded-full p-2 text-white`}
                    >
                      {getIconComponent(link.type)}
                    </div>
                    <div className="w-full flex-1">
                      <span className="font-medium text-gray-800">
                        {link.label || link.type}
                      </span>
                      {link.value && (
                        <p className="max-w-[85%] truncate text-gray-600">
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

        <div className={`${colorClass} flex items-center justify-between p-3`}>
          <span className={`text-xs text-white opacity-80`}>
            Digital Business Card
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
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
