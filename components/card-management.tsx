"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Share2,
  MoreHorizontal,
  Eye,
  Search,
  Lock,
  Globe,
  QrCode,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import type { Card as CardType } from "@/lib/definitions";
import { getCloudinaryUrl, getColorClass, getFontClass } from "@/lib/utils";
import { CardManagementSkeleton } from "@/components/skeletons";
import { useCard, useUser } from "@/lib/swr";
import { NotFoundUI } from "@/components/not-found-ui";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { ShareCardDialog } from "@/components/share-card-dialog";
import { DeleteCardDialog } from "@/components/delete-card-dialog";
import { formatDate } from "@/lib/utils";
import { CustomDomainDialog } from "@/components/custom-domain-dialog";
import { useDynamicHeightAuto } from "@/hooks/use-dynamic-height-auto";

export function getImageUrl(
  card: CardType | null,
  type: "logo" | "profile" | "cover",
) {
  if (!card) return "/placeholder.svg";
  const transform = card.cardDesign.imageTransforms?.[type];

  let imageUrl;

  if (type === "logo") imageUrl = card.cardDesign.logoImage;
  if (type === "profile") imageUrl = card.cardDesign.profileImage;
  if (type === "cover") imageUrl = card.cardDesign.coverImage;

  return getCloudinaryUrl(imageUrl, transform);
}

export function CardManagement() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<
    | (CardType & {
        editable: boolean;
        message?: string;
        dynamicSlug: string;
      })
    | null
  >(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState<boolean>(false);
  const { user, isUserLoading, isUserError } = useUser();
  const { cards, isCardLoading, isCardError } = useCard();
  const filteredCards = cards.filter((card) =>
    card.personalInfo.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );
  const { registerRef, calculatedHeight } = useDynamicHeightAuto();

  useEffect(() => {
    if (
      isCardError &&
      !isCardError.includes("You've reached the maximum number of cards")
    )
      toast.error(isCardError);
    if (isUserError) toast.error(isUserError);
  }, [isCardError, isUserError]);

  if (isCardLoading || isUserLoading) return <CardManagementSkeleton />;

  return (
    <div className="space-y-6">
      <div
        ref={registerRef}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold">Card Management</h2>
          <p className="text-muted-foreground text-sm">
            View and manage your digital business cards.
          </p>
        </div>
        <Button asChild className="bg-primary">
          <Link href="/create">Create new card</Link>
        </Button>
      </div>

      <div ref={registerRef} className="flex items-center">
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
              ? "You haven't created any cards yet."
              : "We couldn't find any cards matching your search. Try a different search term."
          }
          className="border border-dashed"
          style={{
            minHeight: `calc(100vh - ${calculatedHeight}px - 7.83rem)`,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <Card
              key={card._id}
              className={`hover:ring-primary overflow-hidden rounded-lg pt-0 shadow-sm hover:ring-1 hover:ring-offset-1 ${getFontClass(card.cardDesign.fontFamily)}`}
            >
              <div
                className={`relative aspect-2/1 ${getColorClass(card.cardDesign.cardColor)}`}
              >
                {card.cardDesign.coverImage ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl(card, "cover")}
                        alt="Cover"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {card.cardDesign.logoImage && (
                      <div className="absolute right-4 bottom-4 h-12 w-12 overflow-hidden rounded-lg shadow-md">
                        <div className="relative h-full w-full">
                          <Image
                            src={getImageUrl(card, "logo")}
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
                    className={`flex h-full items-center justify-center p-6 text-white`}
                  >
                    {card.cardDesign.logoImage && (
                      <div className="h-16 w-16 overflow-hidden rounded-lg shadow-md">
                        <div className="relative h-full w-full">
                          <Image
                            src={getImageUrl(card, "logo")}
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
              <CardHeader>
                <div className="relative flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-md">
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl(card, "profile")}
                        alt="Profile"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="truncate">
                        {card.personalInfo.fullName}
                      </span>
                      {card.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                    </CardTitle>
                  </div>
                  <div className="absolute top-0 right-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:bg-primary/5"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          {card.editable ? (
                            <Link href={`/edit/${card.dynamicSlug}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit card
                            </Link>
                          ) : (
                            <div
                              className="cursor-not-allowed opacity-50"
                              onClick={() => toast.error(card.message)}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Upgrade to edit
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          {user?.currentPlan === "professional" ? (
                            <div
                              onClick={() => {
                                setSelectedCard(card);
                                setIsDomainDialogOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Custom domain
                            </div>
                          ) : (
                            <div
                              className="cursor-not-allowed opacity-50"
                              onClick={() =>
                                toast.error(
                                  "Upgrade to our professional plan to customize this card domain.",
                                )
                              }
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Upgrade to custom
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/card/${card.dynamicSlug}`}
                            target="_blank"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View card
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCard(card);
                            setIsQrDialogOpen(true);
                          }}
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Show QR code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCard(card);
                            setIsShareDialogOpen(true);
                          }}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share card
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCard(card);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete card
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="text-muted-foreground text-xs">
                Last updated: {formatDate(card.updatedAt, true)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedCard && (
        <CustomDomainDialog
          key={selectedCard._id + "CustomDomainDialog"}
          card={selectedCard}
          open={isDomainDialogOpen}
          setOpen={(val) => setIsDomainDialogOpen(val)}
        />
      )}

      {selectedCard && (
        <QRCodeDialog
          key={selectedCard._id + "QRCodeDialog"}
          card={selectedCard}
          open={isQrDialogOpen}
          setOpen={(val) => setIsQrDialogOpen(val)}
        />
      )}

      {selectedCard && (
        <ShareCardDialog
          key={selectedCard._id + "ShareCardDialog"}
          card={selectedCard}
          open={isShareDialogOpen}
          setOpen={(val) => setIsShareDialogOpen(val)}
        />
      )}

      {selectedCard && (
        <DeleteCardDialog
          key={selectedCard._id + "DeleteCardDialog"}
          card={selectedCard}
          open={isDeleteDialogOpen}
          setOpen={(val) => setIsDeleteDialogOpen(val)}
        />
      )}
    </div>
  );
}
