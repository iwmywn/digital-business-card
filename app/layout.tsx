import type { Metadata } from "next";
import { nunito } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TopProgressBar } from "@/components/top-progress-bar";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className}`}>
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopProgressBar />
          <Toaster richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
