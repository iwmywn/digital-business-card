import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | EZNECT",
    default: "EZNECT",
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="p-2 pl-0">
              <div
                className="overflow-y-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--primary-foreground)] p-2 pt-0 shadow-sm"
                style={{ maxHeight: "calc(100vh - 1rem)" }}
              >
                <Header />
                <section>{children}</section>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
