"use client"

import { useState } from "react"
import { toast } from "sonner"

import { updateCardVisibility } from "@/actions/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loading } from "@/components/loading"
import type { Card as CardType } from "@/lib/definitions"
import { useCard } from "@/lib/swr"

export function ChangeVisibilityDialog({
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
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { cardResponse, cards, mutate } = useCard()

  async function handleVisibilityChange() {
    setIsUpdating(true)

    const { success, error } = await updateCardVisibility(
      card._id,
      !card.isPublic
    )

    if (error || !success) {
      toast.error(error)
    } else {
      mutate({
        ...cardResponse,
        cards: cards.map((c) =>
          c._id === card._id ? { ...c, isPublic: !card.isPublic } : c
        ),
      })
      setOpen(false)
      toast.success(success)
    }

    setIsUpdating(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {card.isPublic ? "Make Card Private" : "Make Card Public"}
          </DialogTitle>
          <DialogDescription>
            {card.isPublic
              ? "This will hide your card from public view. Only you can access it."
              : "This will make your card publicly accessible to anyone with the link."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleVisibilityChange} disabled={isUpdating}>
            {isUpdating ? (
              <Loading />
            ) : card.isPublic ? (
              "Make private"
            ) : (
              "Make public"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
