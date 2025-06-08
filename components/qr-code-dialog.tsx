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
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const cardUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_URL}/card/${card.dynamicSlug}`;
  }, [card.dynamicSlug]);

  const qrOptions = useMemo(
    () => ({
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }),
    [],
  );

  const generateQRCode = useCallback(async () => {
    try {
      const preview = await QRCode.toDataURL(cardUrl, {
        ...qrOptions,
        width: 200,
      });
      setQrCodeUrl(preview);
    } catch (error) {
      console.error("Error generating QR code for preview:", error);
      toast.error(
        "Failed to generate QR code for preview! Please try again later.",
      );
    }
  }, [cardUrl, qrOptions]);

  const downloadQRCode = async () => {
    try {
      const download = await QRCode.toDataURL(cardUrl, {
        ...qrOptions,
        width: 625,
      });

      const link = document.createElement("a");
      link.href = download;
      link.download = `${card.dynamicSlug}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.info("QR code downloaded.");
    } catch (error) {
      console.error("Error generating QR code for download:", error);
      toast.error("Failed to download QR code! Please try again later.");
    }
  };

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
            <DialogTitle className="text-xl">Card QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view the digital business card.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-lg bg-white">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center">
                  <Loading className="size-8" />
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
              Copy link
            </Button>
            <Button
              className="bg-primary sm:flex-1"
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
            >
              Download QR code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
