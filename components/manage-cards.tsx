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
  Plus,
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

// Mock data for business cards
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

export function ManageCards() {
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
          <p className="text-muted-foreground">
            View and manage your digital business cards.
          </p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="mr-2 h-4 w-4" />
          Create New Card
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
                      <DropdownMenuItem
                        onClick={() =>
                          (window.location.href = `/edit-card/${card.id}`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Card
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/card/${card.slug}`, "_blank")
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Card
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
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() =>
                      (window.location.href = `/edit-card/${card.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" />
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
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </Button>
                <Button variant="outline" className="flex-1">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                  </svg>
                  Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.326 0c-6.579.001-10.076 4.216-10.076 8.812 0 2.131 1.191 4.79 3.098 5.633.544.245.472-.054.94-1.844a.425.425 0 00-.102-.417c-2.726-3.153-.532-9.635 5.751-9.635 9.093 0 7.394 12.582 1.582 12.582-1.498 0-2.614-1.176-2.261-2.631.428-1.733 1.266-3.596 1.266-4.845 0-3.148-4.69-2.681-4.69 1.49 0 1.289.456 2.159.456 2.159S6.781 17.2 6.501 18.51c-.474 2.193.064 5.793.111 6.123.029.198.195.262.288.108.149-.249 1.974-2.797 2.484-4.678.186-.685.949-3.465.949-3.465.503.908 1.953 1.668 3.498 1.668 4.596 0 7.918-4.04 7.918-9.053C21.733 3.598 17.062 0 12.326 0z" />
                  </svg>
                  Pinterest
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
