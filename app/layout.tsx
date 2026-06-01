import "./globals.css"

import { Suspense } from "react"
import type { Metadata } from "next"
import { clientEnv } from "@/env/client"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Toaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ProgressProvider } from "@/components/progress-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { nunito } from "@/app/fonts"

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_URL),
  title: {
    template: "%s | Visiq",
    default: "Visiq",
  },
  description:
    "Visiq's digital business cards make sharing your contact info a breeze with a simple QR code. They're easy to customize, quick to update, and perfect for making a strong first impression.",
  openGraph: {
    url: clientEnv.NEXT_PUBLIC_URL,
    siteName: "Visiq",
    type: "website",
  },
  twitter: {
    site: "@Visiq",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className}`}>
        <ThemeProvider>
          <ProgressProvider>
            <TooltipProvider>
              <Toaster richColors closeButton />
              <Suspense
                fallback={
                  <div className="center h-screen">
                    <Spinner />
                  </div>
                }
              >
                {children}
              </Suspense>
            </TooltipProvider>
          </ProgressProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
