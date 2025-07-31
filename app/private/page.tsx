import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PrivateForm } from "@/components/auth/private-form"
import { FormLink } from "@/components/form-link"

export function generateMetadata(): Metadata {
  return { title: "Private" }
}

export default function page() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[url('/images/landing-page-bg-light-xs.png')] bg-cover bg-fixed bg-center bg-no-repeat p-6 sm:bg-[url('/images/landing-page-bg-light-sm.png')] md:bg-[url('/images/landing-page-bg-light-md.png')] md:p-10 lg:bg-[url('/images/landing-page-bg-light-lg.png')] xl:bg-[url('/images/landing-page-bg-light-xl.png')] 2xl:bg-[url('/images/landing-page-bg-light-2xl.png')] dark:bg-[url('/images/landing-page-bg-dark-xs.png')] dark:sm:bg-[url('/images/landing-page-bg-dark-sm.png')] dark:md:bg-[url('/images/landing-page-bg-dark-md.png')] dark:lg:bg-[url('/images/landing-page-bg-dark-lg.png')] dark:xl:bg-[url('/images/landing-page-bg-dark-xl.png')] dark:2xl:bg-[url('/images/landing-page-bg-dark-2xl.png')]">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Secure Access</CardTitle>
            <CardDescription>
              Please contact{" "}
              <FormLink
                href="https://github.com/iwmywn"
                target="_blank"
                className="text-foreground/85"
                rel="noopener noreferrer"
              >
                the administrator
              </FormLink>{" "}
              to receive your access token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrivateForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
