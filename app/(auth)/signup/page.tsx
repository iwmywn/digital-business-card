import { SignUpForm } from "@/components/auth/signup-form";
import { EmailNoticeBanner } from "@/components/auth/email-notice-banner";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function generateMetadata(): Metadata {
  return { title: "Sign up" };
}

export default function page() {
  return (
    <div className="space-y-6">
      <EmailNoticeBanner />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
