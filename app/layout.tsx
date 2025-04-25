import type { Metadata } from "next";
import { montserrat } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    template: "%s | EZNECT",
    default: siteConfig.maintenanceMode ? "Maintenance | EZNECT" : "EZNECT",
  },
  description: siteConfig.maintenanceMode ? "Website is under maintenance" : "",
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
          <main className="flex min-h-screen items-center justify-center text-3xl font-bold">
            Be right back!
          </main>
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
