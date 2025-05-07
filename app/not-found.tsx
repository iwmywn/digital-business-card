import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Ghost } from "lucide-react";

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
      <div className="bg-secondary rounded-full p-3">
        <Ghost />
      </div>
      <h2 className="text-lg font-semibold">
        THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
      </h2>
      <p>This page does not exist.</p>
      <Button asChild>
        <Link href="/home" className="mt-2">
          Go home
        </Link>
      </Button>
    </div>
  );
}
