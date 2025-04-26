"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 px-6 text-center md:px-16">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <Link href="/" className="mt-2">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
