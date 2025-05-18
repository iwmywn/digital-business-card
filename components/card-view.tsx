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
      return <IconComponent className="h-5 w-5" />;
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
        } else if (link.type === "WhatsApp") {
          url = `https://wa.me/${url.replace(/\D/g, "")}`;
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
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <div
        className={`ring-primary overflow-hidden rounded-xl shadow-sm ring-1 ring-offset-1 ${fontClass}`}
      >
        <div className={`relative ${colorClass}`}>
          {card.cardDesign.coverImage ? (
            <div className="relative h-48 w-full overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl("cover")}
                  alt="Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {card.cardDesign.logoImage && (
                <div className="absolute right-4 bottom-4 h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-md">
                  <div className="relative h-full w-full">
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
          ) : (
            <div
              className={`flex h-32 items-center justify-center p-6 text-white`}
            >
              {card.cardDesign.logoImage && (
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-white p-1 shadow-md">
                  <div className="relative h-full w-full">
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

        <div className="space-y-4 bg-white p-6">
          <div className="flex items-start gap-4">
            {card.cardDesign.profileImage && (
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl("profile")}
                    alt="Profile"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div className="w-full space-y-1">
              <h2 className="font-bold wrap-anywhere">
                <span className="text-xl text-nowrap text-black">
                  {card.personalInfo.fullName}
                </span>
                {card.personalInfo.accreditations && (
                  <span className="ml-2 text-sm text-gray-500">
                    {card.personalInfo.accreditations}
                  </span>
                )}
              </h2>
              <p className="font-medium wrap-anywhere">
                {card.personalInfo.jobTitle && (
                  <span className="text-gray-700">
                    {card.personalInfo.jobTitle}
                  </span>
                )}
                {card.personalInfo.department && (
                  <span className="text-gray-500">
                    , {card.personalInfo.department}
                  </span>
                )}
              </p>
              {card.personalInfo.company && (
                <p className="text-sm wrap-anywhere text-gray-500">
                  {card.personalInfo.company}
                </p>
              )}
            </div>
          </div>

          {card.personalInfo.headline && (
            <>
              <Separator className="bg-black/15" />
              <p className="wrap-anywhere text-gray-700 italic">
                {card.personalInfo.headline}
              </p>
            </>
          )}

          {card.personalInfo.bio && (
            <>
              <Separator className="bg-black/15" />
              <p className="text-sm wrap-anywhere text-gray-600">
                {card.personalInfo.bio}
              </p>
            </>
          )}

          {card.links && card.links.length > 0 && (
            <>
              <Separator className="bg-black/15" />
              <div className="space-y-2">
                {card.links.map((link: SerializableLinkType) => (
                  <button
                    key={link.id}
                    className="flex w-full items-center gap-3 text-sm"
                    onClick={() => handleLinkClick(link)}
                    disabled={isLoading[link.id]}
                  >
                    <div
                      className={`${colorClass} rounded-full p-2 text-white`}
                    >
                      {isLoading[link.id] ? (
                        <Loading />
                      ) : (
                        getIconComponent(link.type)
                      )}
                    </div>
                    <div className="w-[calc(100%-2.75rem)] flex-1 text-left">
                      <span className="font-medium text-gray-800">
                        {link.label || link.type}
                      </span>
                      {link.value && (
                        <p className="max-w-full truncate text-gray-600">
                          {link.value}
                        </p>
                      )}
                    </div>
                  </button>
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
  );
}
