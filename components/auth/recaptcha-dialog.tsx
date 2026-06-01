"use client"

import type { Dispatch, SetStateAction } from "react"
import { clientEnv } from "@/env/client"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ReCaptchaPopupProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onVerify: (token: string) => void
}

export function ReCaptchaDialog({
  open,
  setOpen,
  onVerify,
}: ReCaptchaPopupProps) {
  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      toast.error("CAPTCHA verification failed! Please try again.")
      return
    }

    onVerify(token)
    setOpen(false)
  }

  const handleDialogClose = () => {
    toast.error("Please complete the CAPTCHA!")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="w-fit">
        <DialogTitle className="sr-only">CAPTCHA verification</DialogTitle>
        <ReCAPTCHA
          sitekey={clientEnv.NEXT_PUBLIC_RECAPTCHA}
          onChange={handleRecaptchaChange}
          hl="en"
          className="m-3"
        />
      </DialogContent>
    </Dialog>
  )
}
