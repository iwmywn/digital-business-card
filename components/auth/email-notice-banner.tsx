import { Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FormLink } from "@/components/form-link"

export function EmailNoticeBanner() {
  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Note</AlertTitle>
      <AlertDescription className="block">
        It may take up to 5 minutes to receive the verification email. If you
        want to receive it faster, please use{" "}
        <FormLink
          href="https://temp-mail.org"
          target="_blank"
          className="text-foreground/85"
          rel="noopener noreferrer"
        >
          temp-mail.org
        </FormLink>
        .
      </AlertDescription>
    </Alert>
  )
}
