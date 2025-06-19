import { SignUpForm } from "@/components/auth/signup-form";
import { EmailNoticeBanner } from "@/components/auth/email-notice-banner";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign up" };
}

export default function page() {
  return (
    <div className="space-y-6">
      <EmailNoticeBanner />
      <SignUpForm />
    </div>
  );
}
