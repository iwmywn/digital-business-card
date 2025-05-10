import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track the performance of your digital business cards.",
};

export default function page() {
  return <Analytics />;
}
