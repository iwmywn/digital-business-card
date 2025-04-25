import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Maintenance", description: "Website is under maintenance" };
}

export default function page() {
  return (
    <main className="flex min-h-screen items-center justify-center text-3xl font-bold">
      Be right back!
    </main>
  );
}
