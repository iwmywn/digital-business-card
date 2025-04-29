import type { Metadata } from "next";
import { FAQ } from "@/components/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about our digital business card service.",
};

export default function page() {
  return <FAQ />;
}
