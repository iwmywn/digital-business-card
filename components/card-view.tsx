"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { trackCardClick, trackCardView } from "@/actions/card";
import { toast } from "sonner";
import { Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkTypes, type SerializableLinkType } from "@/components/icons";
import type { Card as CardType } from "@/lib/definitions";
import { cn, getColorClass, getFontClass } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getCloudinaryUrl } from "@/lib/utils";
import { Loading } from "@/components/loading";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { ShareCardDialog } from "@/components/share-card-dialog";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
  const [showGradient, setShowGradient] = useState(true);
  const saveButtonRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadFingerprintAndTrack = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      await trackCardView(card._id, visitorId);
    };

    loadFingerprintAndTrack();
  }, [card._id]);

  useEffect(() => {
    const handleScroll = () => {
      const saveBtn = saveButtonRef.current;
      const share = footerRef.current;

      if (saveBtn && share) {
        const saveBottom = saveBtn.getBoundingClientRect().bottom;
        const shareBottom = share.getBoundingClientRect().bottom;

        setShowGradient(saveBottom < shareBottom);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSaveContact = async () => {
    try {
      const vCardData = generateVCard(card);
      const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${card.personalInfo.fullName.replace(/\s+/g, "_")}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.info("Contact saved.");
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact! Please try again later.");
    }
  };

  const generateVCard = (card: CardType) => {
    const nameParts = card.personalInfo.fullName.trim().split(" ");
    let lastName = "";
    let firstName = "";
    let middleName = "";

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      lastName = nameParts[0];
      firstName = nameParts[1];
    } else {
      lastName = nameParts[0];
      firstName = nameParts[nameParts.length - 1];
      middleName = nameParts.slice(1, -1).join(" ");
    }

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${card.personalInfo.fullName}`,
      `N:${lastName};${firstName};${middleName};;`,
    ];

    // if (card.cardDesign.profileImage) {
    //   vCard.push(
    //     `PHOTO:VALUE=URL:${getCloudinaryUrl(card.cardDesign.profileImage, card.cardDesign.imageTransforms?.profile)}`,
    //   );
    // }

    if (card.personalInfo.jobTitle) {
      vCard.push(`TITLE:${card.personalInfo.jobTitle}`);
    }

    if (card.personalInfo.company) {
      vCard.push(`ORG:${card.personalInfo.company}`);
    }

    const noteParts = [];
    if (card.personalInfo.headline) noteParts.push(card.personalInfo.headline);
    if (card.personalInfo.bio) noteParts.push(card.personalInfo.bio);
    if (noteParts.length > 0) {
      vCard.push(`NOTE:${noteParts.join("\\n")}`);
    }

    card.links?.forEach((link: SerializableLinkType) => {
      switch (link.type) {
        case "Email":
          vCard.push(`EMAIL;TYPE=${link.label || link.type}:${link.value}`);
          break;
        case "Phone":
          vCard.push(`TEL;TYPE=${link.label || link.type}:${link.value}`);
          break;
        case "Address":
          vCard.push(`ADR;TYPE=${link.label || link.type}:;;${link.value};;;;`);
          break;
        default:
          vCard.push(`URL;TYPE=${link.label || link.type}:${link.value}`);
      }
    });

    vCard.push("END:VCARD");
    return vCard.join("\r\n");
  };
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

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    await trackCardClick(card._id, visitorId, link.type);

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

    window.open(url, "_blank", "noopener, noreferrer");

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
      <div
        className={`flex min-h-screen items-center justify-center p-8 ${fontClass}`}
      >
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-xl shadow-sm">
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
                  <p className="text-base wrap-anywhere text-gray-600">
                    {card.personalInfo.company}
                  </p>
                )}
                {card.personalInfo.accreditations && (
                  <p className="text-base wrap-anywhere text-gray-500 italic">
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
                  <p className="text-base leading-relaxed wrap-anywhere text-gray-700">
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
              ref={footerRef}
              className={`${colorClass} flex items-center justify-between gap-4 p-3`}
            >
              <span className={`text-xs wrap-anywhere text-white`}>
                {card.cardDesign.brandName}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsQrDialogOpen(true)}
                >
                  <QrCode className="h-4 w-4" />
                  <span className="sr-only">Show QR code</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share link</span>
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={saveButtonRef}
            className={`${showGradient ? "from-primary bg-gradient-to-t to-transparent" : ""} sticky right-0 bottom-0 left-0 z-50 flex items-center justify-center py-4 transition-all duration-200`}
          >
            <button
              onClick={handleSaveContact}
              className={cn(
                "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xs transition-all duration-500 outline-none hover:opacity-80 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                colorClass,
                showGradient ? "px-7 py-3.5" : "px-14 py-7 text-base",
              )}
            >
              Save Contact
            </button>
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
    </>
  );
}
