"use client";

import { useState } from "react";
import Image from "next/image";
import { trackCardClick } from "@/actions/card";
import { toast } from "sonner";
import { Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkTypes, type SerializableLinkType } from "@/components/icons";
import type { Card as CardType } from "@/lib/definitions";
import { getColorClass, getFontClass } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getCloudinaryUrl } from "@/lib/utils";
import { Loading } from "@/components/loading";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { ShareCardDialog } from "@/components/share-card-dialog";

export function CardView({
  card,
}: {
  card: CardType & {
    editable: boolean;
    message?: string;
    dynamicSlug: string;
  };
}) {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const fontClass = getFontClass(card.cardDesign.fontFamily);
  const colorClass = getColorClass(card.cardDesign.cardColor);

  const getIconComponent = (linkType: string) => {
    const foundLinkType = linkTypes.find((lt) => lt.type === linkType);
    if (foundLinkType) {
      const IconComponent = foundLinkType.icon;
      return <IconComponent className="h-6 w-6" />;
    }
    return null;
  };

  async function handleLinkClick(link: SerializableLinkType) {
    setIsLoading((prev) => ({ ...prev, [link.id]: true }));

    const { error } = await trackCardClick(card._id);

    if (error) {
      toast.error(error);
    } else {
      let url = link.value;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        if (link.type === "Email") {
          url = `mailto:${url}`;
        } else if (link.type === "Phone") {
          url = `tel:${url}`;
        } else if (link.type === "Address") {
          url = `https://maps.google.com/?q=${encodeURIComponent(url)}`;
        }
      }

      window.open(url, "_blank");
    }

    setIsLoading((prev) => ({ ...prev, [link.id]: false }));
  }

  const getImageUrl = (type: "logo" | "profile" | "cover") => {
    const transform = card.cardDesign.imageTransforms?.[type];

    let imageUrl;

    if (type === "logo") imageUrl = card.cardDesign.logoImage;
    if (type === "profile") imageUrl = card.cardDesign.profileImage;
    if (type === "cover") imageUrl = card.cardDesign.coverImage;

    return getCloudinaryUrl(imageUrl, transform);
  };

  return (
    <>
      <div
        className={`${colorClass} pointer-events-none fixed inset-0 z-[-9999]`}
      />
      <div className="pointer-events-none fixed inset-0 z-[-8888] bg-white/20" />
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md">
          <div className={`overflow-hidden rounded-xl shadow-sm ${fontClass}`}>
            <div className={`relative aspect-2/1 ${colorClass}`}>
              {card.cardDesign.coverImage ? (
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
                  {card.cardDesign.logoImage && (
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
              {card.cardDesign.profileImage && (
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

              {card.cardDesign.logoImage && card.cardDesign.coverImage && (
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

              {card.cardDesign.profileImage && <div className="mt-10" />}

              <div className="w-full space-y-1">
                <h2 className="text-[1.75rem] leading-snug font-bold wrap-anywhere text-black">
                  {card.personalInfo.fullName}
                </h2>
                {card.personalInfo.jobTitle && (
                  <p className="text-xl leading-tight font-semibold wrap-anywhere text-gray-800">
                    {card.personalInfo.jobTitle}
                  </p>
                )}
                {card.personalInfo.department && (
                  <p className="text-lg leading-tight font-medium wrap-anywhere text-gray-700">
                    {card.personalInfo.department}
                  </p>
                )}
                {card.personalInfo.company && (
                  <p className="text-base wrap-anywhere text-gray-500">
                    {card.personalInfo.company}
                  </p>
                )}
                {card.personalInfo.accreditations && (
                  <p className="text-base wrap-anywhere text-gray-400 italic">
                    {card.personalInfo.accreditations}
                  </p>
                )}
              </div>

              {card.personalInfo.headline && (
                <>
                  <Separator className="bg-black/15" />
                  <p className="text-base leading-snug wrap-anywhere text-gray-700 italic">
                    {card.personalInfo.headline}
                  </p>
                </>
              )}

              {card.personalInfo.bio && (
                <>
                  <Separator className="bg-black/15" />
                  <p className="text-base leading-relaxed wrap-anywhere text-gray-600">
                    {card.personalInfo.bio}
                  </p>
                </>
              )}

              {card.links && card.links.length > 0 && (
                <>
                  <Separator className="bg-black/15" />
                  <div className="space-y-2">
                    {card.links.map((link: SerializableLinkType) => (
                      <div
                        key={link.id}
                        className={`flex cursor-pointer items-center gap-3 text-base ${isLoading[link.id] ? "pointer-events-none" : ""}`}
                        onClick={() => handleLinkClick(link)}
                      >
                        <div
                          className={`${colorClass} flex items-center justify-center rounded-full p-2 text-white`}
                        >
                          {isLoading[link.id] ? (
                            <Loading className="h-6 w-6 border-white border-t-black/10" />
                          ) : (
                            getIconComponent(link.type)
                          )}
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
              className={`${colorClass} flex items-center justify-between p-3`}
            >
              <span className={`text-xs text-white opacity-80`}>
                Digital Business Card
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsQrDialogOpen(true)}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <QRCodeDialog
            card={card}
            open={isQrDialogOpen}
            setOpen={(val) => setIsQrDialogOpen(val)}
          />

          <ShareCardDialog
            card={card}
            open={isShareDialogOpen}
            setOpen={(val) => setIsShareDialogOpen(val)}
          />
        </div>
      </div>
    </>
  );
}
