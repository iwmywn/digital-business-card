import { LogInForm } from "@/components/login-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Log in" };
}

export default function page() {
  return <LogInForm />;
}
