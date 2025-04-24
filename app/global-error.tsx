"use client";

import { Montserrat } from "next/font/google";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className={`${montserrat.className} antialiased`}>
        <main className="relative z-10 flex h-screen flex-col items-center gap-2 bg-white px-6 pt-52 text-center md:px-16">
          <h2 className="text-lg font-semibold">Something went wrong!</h2>
          <p>{error.message}</p>
          <Button onClick={() => reset()}>Try again</Button>
        </main>
      </body>
    </html>
  );
}
