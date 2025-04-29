import type { Metadata } from "next";
import { Information } from "@/components/information";

export const metadata: Metadata = {
  title: "Account Information",
  description: "Manage your account information and preferences.",
};

export default function page() {
  return <Information />;
}
