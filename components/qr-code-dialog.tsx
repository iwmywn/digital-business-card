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
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { handleCopyLink } from "@/lib/utils";

export function QRCodeDialog({
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
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateQRCode = useCallback(async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/card/${card.dynamicSlug}`;
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
  }, [card.dynamicSlug]);

  function downloadQRCode() {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${card?.dynamicSlug || "card"}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    if (open) {
      generateQRCode();
    }
  }, [open, generateQRCode]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
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
                  <Loading className="h-8 w-8" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              {process.env.NEXT_PUBLIC_URL}/card/{card.dynamicSlug}
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => handleCopyLink(card.dynamicSlug)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
            <Button
              className="bg-primary sm:flex-1"
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
