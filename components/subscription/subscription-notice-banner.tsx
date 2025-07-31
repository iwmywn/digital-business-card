import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FormLink } from "@/components/form-link"

export function SubscriptionNoticeBanner() {
  return (
    <Alert variant="default">
      <AlertTriangle />
      <AlertTitle>Note</AlertTitle>
      <AlertDescription className="block">
        This website is currently in development. You can use test cards from{" "}
        <FormLink
          href="https://docs.stripe.com/testing#cards"
          target="_blank"
          className="text-foreground/85"
          rel="noopener noreferrer"
        >
          Stripe&apos;s testing documentation
        </FormLink>
        .
      </AlertDescription>
    </Alert>
  )
}
