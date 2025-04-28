import { SignInForm } from "@/components/signin-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign in" };
}

export default function page() {
  return <SignInForm />;
}
