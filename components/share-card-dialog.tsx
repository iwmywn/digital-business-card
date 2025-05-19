import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card as CardType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleCopyLink } from "@/lib/utils";
import { SimpleIconComponent } from "@/components/icons";
import {
  siBluesky,
  siFacebook,
  siInstagram,
  siSnapchat,
  siThreads,
  siX,
} from "simple-icons";

export function ShareCardDialog({
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Share Card</DialogTitle>
          <DialogDescription>
            Share this digital business card with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input
                value={`${process.env.NEXT_PUBLIC_URL}/card/${card.dynamicSlug}`}
                readOnly
                className="pr-20"
              />
              <Button
                className="bg-primary absolute top-0 right-0 h-full rounded-l-none"
                onClick={() => handleCopyLink(card.dynamicSlug)}
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
  );
}
