"use client";

import { useState } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

const mockCards = [
  {
    id: "1",
    name: "Professional Card",
    image: "/placeholder.svg?height=100&width=200",
    primaryColor: "#ff4d4d",
    secondaryColor: "#333333",
    views: 245,
    lastUpdated: "2023-12-15T10:30:00Z",
    isPublic: true,
    slug: "john-doe-professional",
  },
  {
    id: "2",
    name: "Creative Portfolio",
    image: "/placeholder.svg?height=100&width=200",
    primaryColor: "#4d79ff",
    secondaryColor: "#222222",
    views: 187,
    lastUpdated: "2024-01-05T14:20:00Z",
    isPublic: true,
    slug: "john-doe-creative",
  },
  {
    id: "3",
    name: "Networking Event",
    image: "/placeholder.svg?height=100&width=200",
    primaryColor: "#50c878",
    secondaryColor: "#2a2a2a",
    views: 92,
    lastUpdated: "2024-02-10T09:15:00Z",
    isPublic: false,
    slug: "john-doe-networking",
  },
  {
    id: "4",
    name: "Conference Speaker",
    image: "/placeholder.svg?height=100&width=200",
    primaryColor: "#9370db",
    secondaryColor: "#282828",
    views: 156,
    lastUpdated: "2024-03-01T16:45:00Z",
    isPublic: true,
    slug: "john-doe-speaker",
  },
];

export function CardManagement() {
  const [cards, setCards] = useState(mockCards);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<
    (typeof mockCards)[0] | null
  >(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleDeleteCard(id: string) {
    setCards(cards.filter((card) => card.id !== id));
    setIsDeleteDialogOpen(false);
    toast.success("Card deleted successfully");
  }

  function handleCopyLink(slug: string) {
    const link = `https://eznect.com/card/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Cards</h2>
          <p className="text-muted-foreground text-sm">
            View and manage your digital business cards.
          </p>
        </div>
        <Button asChild>
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
        <Card className="rounded-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted rounded-full p-3">
              <Search className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No cards found</h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              We couldn&apos;t find any cards matching your search. Try a
              different search term.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <Card key={card.id} className="overflow-hidden rounded-lg">
              <div
                className="relative h-32"
                style={{ backgroundColor: card.secondaryColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: card.primaryColor }}
                  >
                    <span className="text-xl font-bold text-white">
                      {card.name.charAt(0)}
                    </span>
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
                        <Link href={`/edit-card/${card.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Card
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/card/${card.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View Card
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCard(card);
                          setIsQrDialogOpen(true);
                        }}
                      >
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
                  <span className="truncate">{card.name}</span>
                  {!card.isPublic && (
                    <span className="bg-muted rounded-full px-2 py-1 text-xs">
                      Private
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Last updated: {formatDate(card.lastUpdated)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="text-muted-foreground text-sm">
                  {card.views} views
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCard(card);
                      setIsQrDialogOpen(true);
                    }}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(card.slug)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/edit-card/${card.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
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
              <Image
                src="/placeholder.svg?height=200&width=200&text=QR+Code"
                alt="QR Code"
                width={192}
                height={192}
              />
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              {selectedCard && `https://eznect.com/card/${selectedCard.slug}`}
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
            <Button className="bg-red-500 hover:bg-red-600 sm:flex-1">
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
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: selectedCard?.primaryColor || "#ff4d4d",
                color: "white",
              }}
            >
              <span className="text-xl font-bold">
                {selectedCard?.name.charAt(0) || "C"}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium">{selectedCard?.name}</h4>
              <p className="text-muted-foreground text-sm">
                Created on{" "}
                {selectedCard && formatDate(selectedCard.lastUpdated)}
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
              onClick={() => handleDeleteCard(selectedCard?.id || "")}
            >
              Delete Card
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
                      ? `https://eznect.com/card/${selectedCard.slug}`
                      : ""
                  }
                  readOnly
                  className="pr-20"
                />
                <Button
                  className="absolute top-0 right-0 h-full rounded-l-none bg-red-500 hover:bg-red-600"
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
