import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for our digital business card platform.",
};

export default function page() {
  return <PrivacyPolicy />;
}
