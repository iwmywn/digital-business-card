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
import { siWhatsapp, siX } from "simple-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail } from "lucide-react";

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
  const cardUrl = `${process.env.NEXT_PUBLIC_URL}/card/${card.dynamicSlug}`;
  const cardTitle = `Check out ${card.personalInformation.fullName}'s digital business card`;

  const shareHandlers = {
    whatsapp: () => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(cardTitle + " " + cardUrl)}`;
      window.open(url, "_blank", "noopener, noreferrer");
    },

    email: () => {
      const subject = cardTitle;
      const body = `Hi,\n\nTake a look at this digital business card:\n\n${cardUrl}\n\nBest regards,`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
    },

    x: () => {
      const url = `https://x.com/intent/post?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent(cardTitle)}`;
      window.open(url, "_blank", "noopener, noreferrer");
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Share Card</DialogTitle>
          <DialogDescription>
            Share this digital business card with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input value={cardUrl} readOnly className="pr-20" />
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
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={shareHandlers.whatsapp}
                    >
                      <SimpleIconComponent icon={siWhatsapp} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share via WhatsApp</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={shareHandlers.email}
                    >
                      <Mail />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share via Email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={shareHandlers.x}
                    >
                      <SimpleIconComponent icon={siX} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share on X</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
