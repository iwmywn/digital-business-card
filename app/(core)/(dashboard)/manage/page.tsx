import type { Metadata } from "next";
import { ManageCards } from "@/components/manage-cards";

export const metadata: Metadata = {
  title: "Manage Cards",
  description: "View and manage your digital business cards.",
};

export default function ManageCardsPage() {
  return <ManageCards />;
}
