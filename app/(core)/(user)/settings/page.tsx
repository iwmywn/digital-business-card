import type { Metadata } from "next";
import { Settings } from "@/components/settings";

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage your account information, update your password, and configure notification preferences.",
};

export default function page() {
  return <Settings />;
}
