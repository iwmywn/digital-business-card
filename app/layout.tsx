import type { Metadata } from "next"

import { nunito } from "@/app/fonts"

import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { TopProgressBar } from "@/components/top-progress-bar"

export const metadata: Metadata = {
  title: {
    template: "%s | Visiq",
    default: "Visiq",
  },
  description:
    "Visiq's digital business cards make sharing your contact info a breeze with a simple QR code. They're easy to customize, quick to update, and perfect for making a strong first impression.",
  openGraph: {
    url: process.env.NEXT_PUBLIC_URL,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopProgressBar />
          <Toaster richColors closeButton />
          {children}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
