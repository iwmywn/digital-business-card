import type { Metadata } from "next";
import { montserrat } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    template: "%s | EZNECT",
    default: "EZNECT",
  },
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (siteConfig.maintenanceMode) {
    return (
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
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
