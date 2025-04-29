import { SignUpForm } from "@/components/signup-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Sign up" };
}

export default function page() {
  return <SignUpForm />;
}
