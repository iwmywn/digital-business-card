import type { Metadata } from "next";
import { CardManagement } from "@/components/card-management";

export const metadata: Metadata = {
  title: "Card management",
  description: "View and manage your digital business cards.",
};

export default function ManageCardsPage() {
  return <CardManagement />;
}
