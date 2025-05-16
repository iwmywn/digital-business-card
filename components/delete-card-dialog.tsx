import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card as CardType } from "@/lib/definitions";
import Image from "next/image";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useCard } from "@/lib/swr";
import { getImageUrl } from "@/components/card-management";
import { deleteCard } from "@/actions/card";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export function DeleteCardDialog({
  card,
  open,
  setOpen,
}: {
  card: CardType & {
    editable: boolean;
    message?: string;
    dynamicSlug: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { cardResponse, cards, mutate } = useCard();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  async function handleDeleteCard(id: string) {
    setIsDeleting(true);
    const { success, error } = await deleteCard(id);
    if (error || !success) {
      toast.error(error);
    } else {
      mutate({
        ...cardResponse,
        cards: cards.filter((card) => card._id !== id),
      });
      setOpen(false);
      toast.success(success);
    }
    setIsDeleting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Card</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this card? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4 py-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-white shadow-md">
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
            <h4 className="text-base font-medium">
              {card.personalInfo.fullName}
            </h4>
            <p className="text-muted-foreground text-sm">
              Created on {formatDate(card.createdAt, true)}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteCard(card._id)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loading /> : "Delete card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
