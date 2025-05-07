import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "NOT FOUND",
};

export default function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center md:px-16",
        className,
      )}
    >
      <h2 className="text-lg font-semibold">
        THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
      </h2>
      <p>This page does not exist.</p>
      <Link href="/home" className="mt-2">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
