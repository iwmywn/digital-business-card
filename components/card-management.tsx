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
  Link as LinkIcon,
  Info,
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
import { EmptyState } from "@/components/empty-state";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { ShareCardDialog } from "@/components/share-card-dialog";
import { DeleteCardDialog } from "@/components/delete-card-dialog";
import { formatDate } from "@/lib/utils";
import { CustomSlugDialog } from "@/components/custom-slug-dialog";
import { useDynamicHeightAuto } from "@/hooks/use-dynamic-height-auto";
import { ChangeVisibilityDialog } from "@/components/change-visibility-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isSlugDialogOpen, setIsSlugDialogOpen] = useState<boolean>(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] =
    useState<boolean>(false);
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
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
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

      <Alert ref={registerRef} variant="default">
        <Info />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Your card will appear to others based on your current plan or its
          validity period. For example, if your card uses fonts and colors from
          the basic plan, but your current plan is free or your basic plan has
          expired, others will see your card with free plan styles (including
          link limits). Similarly, if your card uses professional plan styles
          but your current plan is not professional or your professional plan
          has expired, it will also be shown to others with free plan styles
          (including link limits).
        </AlertDescription>
      </Alert>

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
        <EmptyState
          icon={<Search />}
          title="NO CARDS FOUND"
          message={
            cards.length === 0
              ? "You haven't created any cards yet."
              : "We couldn't find any cards matching your search. Try a different search term."
          }
          style={{
            minHeight: `calc(100vh - ${calculatedHeight}px - 9.33rem)`,
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
                      <div className="ring-primary absolute right-4 bottom-4 h-12 w-12 overflow-hidden rounded-lg shadow-md ring-1 ring-offset-1">
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
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span className="max-w-[calc(100%-4.625rem)] truncate">
                        {card.personalInfo.fullName}
                      </span>
                      <span title={card.isPublic ? "Public" : "Private"}>
                        {card.isPublic ? (
                          <Globe size={14} />
                        ) : (
                          <Lock size={14} />
                        )}
                      </span>
                    </CardTitle>
                  </div>
                  <div className="absolute right-0">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:bg-primary/5"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          Card Actions
                        </TooltipContent>
                      </Tooltip>
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
                                setIsSlugDialogOpen(true);
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Customize link
                            </div>
                          ) : (
                            <div
                              className="cursor-not-allowed opacity-50"
                              onClick={() =>
                                toast.error(
                                  "Upgrade to our professional plan to customize this card link.",
                                )
                              }
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Upgrade to customize
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          {user?.currentPlan === "professional" ? (
                            <div
                              onClick={() => {
                                setSelectedCard(card);
                                setIsVisibilityDialogOpen(true);
                              }}
                            >
                              {card.isPublic ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Make private
                                </>
                              ) : (
                                <>
                                  <Globe className="mr-2 h-4 w-4" />
                                  Make public
                                </>
                              )}
                            </div>
                          ) : (
                            <div
                              className="cursor-not-allowed opacity-50"
                              onClick={() =>
                                toast.error(
                                  "Upgrade to our professional plan to change this card visibility.",
                                )
                              }
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Upgrade to change visibility
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
        <CustomSlugDialog
          key={selectedCard._id + "CustomSlugDialog"}
          card={selectedCard}
          open={isSlugDialogOpen}
          setOpen={(val) => setIsSlugDialogOpen(val)}
        />
      )}

      {selectedCard && (
        <ChangeVisibilityDialog
          key={selectedCard._id + "VisibilityDialog"}
          card={selectedCard}
          open={isVisibilityDialogOpen}
          setOpen={(val) => setIsVisibilityDialogOpen(val)}
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
