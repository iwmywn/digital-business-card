"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  QrCode,
  Share2,
  MoreHorizontal,
  Copy,
  Eye,
  Download,
  Search,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { SimpleIconComponent } from "@/components/icons";
import {
  siX,
  siInstagram,
  siThreads,
  siBluesky,
  siFacebook,
  siSnapchat,
} from "simple-icons";
import Link from "next/link";
import { deleteCard } from "@/actions/card";
import QRCode from "qrcode";
import { Card as CardType } from "@/lib/definitions";
import { getColorClass } from "@/lib/utils";
import { CardManagementSkeleton } from "@/components/skeletons";
import { useCard } from "@/lib/hooks";
import { NotFoundUI } from "@/components/not-found-ui";
import { Loading } from "@/components/loading";

export function CardManagement() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { cardData, cards, isCardLoading, isCardError, mutate } = useCard();
  const filteredCards = cards.filter((card) =>
    card.personalInfo.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  async function handleDeleteCard(id: string) {
    setIsDeleting(true);
    const { error } = await deleteCard(id);
    if (error) {
      toast.error(error);
    } else {
      mutate({ ...cardData, cards: cards.filter((card) => card._id !== id) });
      setIsDeleteDialogOpen(false);
      toast.success("Card deleted.");
    }
    setIsDeleting(false);
  }

  function handleCopyLink(slug: string) {
    const link = `${process.env.NEXT_PUBLIC_URL}/card/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard.");
  }

  function formatDate(dateParam: Date) {
    const date = new Date(dateParam);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  async function generateQRCode(slug: string) {
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/card/${slug}`;
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

  function handleQrCodeClick(card: CardType) {
    setSelectedCard(card);
    generateQRCode(card.slug);
    setIsQrDialogOpen(true);
  }

  function downloadQRCode() {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${selectedCard?.slug || "card"}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getImageUrl = (card: CardType, type: "logo" | "profile" | "cover") => {
    const transform = card.cardDesign.imageTransforms?.[type];
    if (transform?.croppedImageUrl) {
      return transform.croppedImageUrl;
    }

    if (type === "logo") return card.cardDesign.logoImage;
    if (type === "profile") return card.cardDesign.profileImage;
    return card.cardDesign.coverImage;
  };

  useEffect(() => {
    if (
      isCardError &&
      !isCardError.includes("You've reached the maximum number of cards")
    )
      toast.error(isCardError);
  }, [isCardError]);

  if (isCardLoading) return <CardManagementSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Card Management</h2>
          <p className="text-muted-foreground text-sm">
            View and manage your digital business cards
          </p>
        </div>
        <Button asChild className="bg-primary">
          <Link href="/create">Create New Card</Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search cards..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <NotFoundUI
          icon={<Search />}
          title="NO CARDS FOUND"
          message={
            cards.length === 0
              ? "You haven't created any cards yet. Create your first card to get started."
              : "We couldn't find any cards matching your search. Try a different search term."
          }
          className="border border-dashed"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <Card key={card._id} className="overflow-hidden rounded-lg">
              <div
                className="relative h-32"
                style={{
                  backgroundColor: getColorClass(card.cardDesign.cardColor),
                }}
              >
                <div
                  className={`absolute inset-0 ${getColorClass(card.cardDesign.cardColor)}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {card.cardDesign.profileImage && (
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-white p-1">
                        <div className="relative h-full w-full">
                          <Image
                            src={
                              getImageUrl(card, "profile") || "/placeholder.svg"
                            }
                            alt="Profile"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            card.editable
                              ? `/edit/${card._id}`
                              : "/subscription"
                          }
                          className={
                            !card.editable
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }
                          onClick={(e) => {
                            if (!card.editable) {
                              e.preventDefault();
                              toast.error(card.message);
                            }
                          }}
                        >
                          {!card.editable && <Lock className="mr-2 h-4 w-4" />}
                          {card.editable && <Edit className="mr-2 h-4 w-4" />}
                          {card.editable ? "Edit Card" : "Upgrade to Edit"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/card/${card.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View Card
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQrCodeClick(card)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCard(card);
                          setIsShareDialogOpen(true);
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Card
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCard(card);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{card.personalInfo.fullName}</span>
                  {!card.isPublic && (
                    <span className="bg-muted rounded-full px-2 py-1 text-xs">
                      Private
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Last updated: {formatDate(card.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  {card.views} views
                </div>
                <div className="text-muted-foreground text-sm">
                  {card.clicks} clicks
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Card QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view the digital business card.
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
              {selectedCard &&
                `${process.env.NEXT_PUBLIC_URL}/card/${selectedCard.slug}`}
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => handleCopyLink(selectedCard?.slug || "")}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button
              className="bg-primary sm:flex-1"
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this card? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4 py-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                selectedCard?.cardDesign.cardColor === "gradient"
                  ? "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400"
                  : getColorClass(selectedCard?.cardDesign.cardColor || "red")
              }`}
            >
              <span className="text-xl font-bold text-white">
                {selectedCard?.personalInfo.fullName.charAt(0) || "C"}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium">
                {selectedCard?.personalInfo.fullName}
              </h4>
              <p className="text-muted-foreground text-sm">
                Created on {selectedCard && formatDate(selectedCard.createdAt)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteCard(selectedCard?._id || "")}
              disabled={isDeleting}
            >
              {isDeleting ? <Loading /> : "Delete Card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Card</DialogTitle>
            <DialogDescription>
              Share your digital business card with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Input
                  value={
                    selectedCard
                      ? `${process.env.NEXT_PUBLIC_URL}/card/${selectedCard.slug}`
                      : ""
                  }
                  readOnly
                  className="pr-20"
                />
                <Button
                  className="bg-primary absolute top-0 right-0 h-full rounded-l-none"
                  onClick={() => handleCopyLink(selectedCard?.slug || "")}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Share via</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siX} />
                </Button>
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siInstagram} />
                </Button>
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siThreads} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siBluesky} />
                </Button>
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siFacebook} />
                </Button>
                <Button variant="outline" className="flex-1">
                  <SimpleIconComponent icon={siSnapchat} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
