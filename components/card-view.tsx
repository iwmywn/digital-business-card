"use client";

import { useState } from "react";
import Image from "next/image";
import { trackCardClick } from "@/actions/card";
import { toast } from "sonner";
import { Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "qrcode";
import { linkTypes, type SerializableLinkType } from "@/components/icons";
import type { Card as CardType } from "@/lib/definitions";
import { getColorClass, getFontClass } from "@/lib/utils";
import { Separator } from "@/components/separator";
import { getCloudinaryUrl } from "@/lib/utils";

export function CardView({ card }: { card: CardType }) {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
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

  async function generateQRCode() {
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/card/${card.slug}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        margin: 1,
        width: 200,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code! Please try again later.");
    }
  }

  function handleQrCodeClick() {
    generateQRCode();
    setIsQrDialogOpen(true);
  }

  function handleShareClick() {
    if (navigator.share) {
      navigator
        .share({
          title: `${card.personalInfo.fullName} - Digital Business Card`,
          text:
            card.personalInfo.headline ||
            `Check out ${card.personalInfo.fullName}'s digital business card`,
          url: `${process.env.NEXT_PUBLIC_URL}/card/${card.slug}`,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          handleCopyLink();
        });
    } else {
      handleCopyLink();
    }
  }

  function handleCopyLink() {
    const link = `${process.env.NEXT_PUBLIC_URL}/card/${card.slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard.");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <div
        className={`border-primary/80 overflow-hidden rounded-xl border shadow-lg ${fontClass}`}
      >
        <div className={`relative ${colorClass}`}>
          {card.cardDesign.coverImage ? (
            <div className="relative h-48 w-full overflow-hidden">
              <div className="relative h-full w-full">
                <Image
                  src={getCloudinaryUrl(
                    card.cardDesign.coverImage,
                    card.cardDesign.imageTransforms?.cover,
                  )}
                  alt="Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {card.cardDesign.logoImage && (
                <div className="absolute right-4 bottom-4 h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-md">
                  <div className="relative h-full w-full">
                    <Image
                      src={getCloudinaryUrl(
                        card.cardDesign.logoImage,
                        card.cardDesign.imageTransforms?.logo,
                      )}
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
                      src={getCloudinaryUrl(
                        card.cardDesign.logoImage,
                        card.cardDesign.imageTransforms?.logo,
                      )}
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
                    src={getCloudinaryUrl(
                      card.cardDesign.profileImage,
                      card.cardDesign.imageTransforms?.profile,
                    )}
                    alt="Profile"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <h2 className="font-bold text-black">
                <span className="text-xl">{card.personalInfo.fullName}</span>
                {card.personalInfo.accreditations && (
                  <span className="ml-2 text-sm text-gray-500">
                    {card.personalInfo.accreditations}
                  </span>
                )}
              </h2>
              <p className="font-medium">
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
                <p className="text-sm text-gray-500">
                  {card.personalInfo.company}
                </p>
              )}
            </div>
          </div>

          {card.personalInfo.headline && (
            <>
              <Separator className="bg-black/15" />
              <p className="text-gray-700 italic">
                {card.personalInfo.headline}
              </p>
            </>
          )}

          {card.personalInfo.bio && (
            <>
              <Separator className="bg-black/15" />
              <p className="text-sm text-gray-600">{card.personalInfo.bio}</p>
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
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        getIconComponent(link.type)
                      )}
                    </div>
                    <div className="w-full flex-1 text-left">
                      <span className="font-medium text-gray-800">
                        {link.label || link.type}
                      </span>
                      {link.value && (
                        <p className="max-w-[85%] truncate text-gray-600">
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
              onClick={handleQrCodeClick}
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Card QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view this digital business card.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="rounded-lg bg-white p-4">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={192}
                  height={192}
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              {`${process.env.NEXT_PUBLIC_URL}/card/${card.slug}`}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
