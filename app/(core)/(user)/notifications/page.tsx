import type { Metadata } from "next";
import { NotFoundUI } from "@/components/not-found-ui";
import { BellOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "View updates, alerts, and important messages related to your digital business card.",
};

export default function page() {
  return (
    <NotFoundUI
      icon={<BellOff />}
      title="NO NOTIFICATIONS"
      message="You're all caught up! There are no new notifications at the moment."
      className="min-h-[calc(100vh-4.83rem)]"
    />
  );
}
