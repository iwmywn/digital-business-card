import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { deleteCard } from "@/actions/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getImageUrl } from "@/components/card/card-management"
import { Loading } from "@/components/loading"
import { Card as CardType } from "@/lib/definitions"
import { useCard } from "@/lib/swr"
import { formatDate } from "@/lib/utils"

export function DeleteCardDialog({
  card,
  open,
  setOpen,
}: {
  card: CardType & {
    editable: boolean
    message?: string
    dynamicSlug: string
  }
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { cardResponse, cards, mutate } = useCard()
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  async function handleDeleteCard() {
    setIsDeleting(true)

    const { success, error } = await deleteCard(card._id)

    if (error || !success) {
      toast.error(error)
    } else {
      mutate({
        ...cardResponse,
        cards: cards.filter((c) => c._id !== card._id),
      })
      setOpen(false)
      toast.success(success)
    }

    setIsDeleting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Delete Card</DialogTitle>
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
              {card.personalInformation.fullName}
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
            onClick={handleDeleteCard}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loading className="border-white border-t-black/10" />
            ) : (
              "Delete card"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
