import type { Metadata } from "next";
import { TermsOfService } from "@/components/terms-of-service";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using our digital business card platform.",
};

export default function page() {
  return <TermsOfService />;
}
