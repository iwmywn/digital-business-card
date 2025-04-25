import type { Metadata } from "next";
import { nunito } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    template: "%s | EZNECT",
    default: "EZNECT",
  },
  description:
    "Eznect's digital business cards make sharing your contact info a breeze with a simple QR code. They're easy to customize, quick to update, and perfect for making a strong first impression.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (siteConfig.maintenanceMode) {
    return (
      <html lang="en">
        <body className={`${nunito.className} antialiased`}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <div id="popups" className="relative z-[9999]" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
