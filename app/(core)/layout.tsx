import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="p-2 peer-data-[state=collapsed]:max-w-[calc(100vw-4rem)] peer-data-[state=collapsed]:pl-0 peer-data-[state=expanded]:max-w-[calc(100vw-16rem)] peer-data-[state=expanded]:transition-[max-width] peer-data-[state=expanded]:duration-500">
        <div
          className="h-full overflow-y-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--primary-foreground)] p-2 pt-0 shadow-sm"
          style={{ maxHeight: "calc(100vh - 1rem)" }}
        >
          <Header />
          <section>{children}</section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
