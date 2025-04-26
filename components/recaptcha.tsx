"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ReCaptchaPopupProps {
  onClose: () => void;
  setRecaptchaToken: (token: string | null) => void;
}

export default function ReCaptchaPopup({
  onClose,
  setRecaptchaToken,
}: ReCaptchaPopupProps) {
  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      toast.error("CAPTCHA verification failed! Please try again.");
      return;
    }

    setRecaptchaToken(token);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleDialogClose = () => {
    toast.error("Please complete the CAPTCHA!");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleDialogClose}>
      <DialogContent className="w-fit">
        <VisuallyHidden>
          <DialogTitle>CAPTCHA verification</DialogTitle>
        </VisuallyHidden>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA!}
          onChange={handleRecaptchaChange}
          hl="en"
          className="m-3"
        />
      </DialogContent>
    </Dialog>
  );
}
