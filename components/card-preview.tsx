"use client";

import type React from "react";
import Image from "next/image";
import type { CardDesignValues } from "@/components/card-design";
import type { PersonalInfoValues } from "@/components/personal-info";
import type { LinkType } from "@/components/icons";
import { QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nunito, inter, roboto, montserrat, openSans } from "@/app/fonts";

interface CardPreviewProps {
  cardDesign: CardDesignValues;
  personalInfo: PersonalInfoValues;
  links: LinkType[];
  size?: "small" | "large";
}

export function CardPreview({
  cardDesign,
  personalInfo,
  links,
  size = "large",
}: CardPreviewProps) {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      gradient: "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
      red: "bg-red-400",
      orange: "bg-orange-400",
      amber: "bg-amber-400",
      yellow: "bg-yellow-400",
      lime: "bg-lime-400",
      green: "bg-green-400",
      emerald: "bg-emerald-400",
      teal: "bg-teal-400",
      cyan: "bg-cyan-400",
      sky: "bg-sky-400",
      blue: "bg-blue-400",
      indigo: "bg-indigo-400",
      violet: "bg-violet-400",
      purple: "bg-purple-400",
      fuchsia: "bg-fuchsia-400",
      pink: "bg-pink-400",
      rose: "bg-rose-400",
      slate: "bg-slate-400",
      gray: "bg-gray-400",
      zinc: "bg-zinc-400",
      neutral: "bg-neutral-400",
      stone: "bg-stone-400",
    };

    return colorMap[color] || "bg-gray-500";
  };

  const isSmall = size === "small";
  const colorClass = getColorClass(cardDesign.cardColor);

  const getFontClass = (fontFamily: string): React.CSSProperties => {
    const fontMap: Record<string, typeof inter> = {
      inter: inter,
      roboto: roboto,
      nunito: nunito,
      montserrat: montserrat,
      opensans: openSans,
    };

    return {
      fontFamily:
        fontMap[fontFamily]?.style?.fontFamily || inter.style.fontFamily,
    };
  };

  const fontStyle = getFontClass(cardDesign.fontFamily);

  const getImageUrl = (type: "logo" | "profile" | "cover") => {
    const transform = cardDesign.imageTransforms?.[type];
    if (transform?.croppedImageUrl) {
      return transform.croppedImageUrl;
    }

    if (type === "logo") return cardDesign.logoImage;
    if (type === "profile") return cardDesign.profileImage;
    return cardDesign.coverImage;
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        className="overflow-hidden rounded-xl border border-gray-200 shadow-lg"
        style={fontStyle}
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
                <div className="absolute bottom-4 left-4 h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-md">
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
              {cardDesign.logoImage ? (
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
              ) : (
                <h2 className="text-center text-2xl font-bold">
                  {personalInfo.company || "Company Name"}
                </h2>
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
              <h2 className="text-xl font-bold text-gray-900">
                {personalInfo.fullName || "Your Name"}
                {personalInfo.accreditations && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {personalInfo.accreditations}
                  </span>
                )}
              </h2>
              <p className="font-medium text-gray-700">
                {personalInfo.jobTitle || "Job Title"}
                {personalInfo.department && (
                  <span className="text-gray-500">
                    , {personalInfo.department}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {personalInfo.company || "Company Name"}
              </p>
            </div>
          </div>

          {personalInfo.headline && (
            <div className="border-t border-gray-100 pt-3">
              <p className="text-gray-700 italic">{personalInfo.headline}</p>
            </div>
          )}

          {personalInfo.bio && (
            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600">{personalInfo.bio}</p>
            </div>
          )}

          {links.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              {links.map((link) => {
                const IconComponent = link.icon;
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div
                      className={`${colorClass} rounded-full p-2 text-white`}
                    >
                      <IconComponent className="h-4 w-4" />
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
                );
              })}
            </div>
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
