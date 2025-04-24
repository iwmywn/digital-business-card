import { ForgotPasswordForm } from "@/components/forgot-password-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Forgot password" };
}

export default function page() {
  return <ForgotPasswordForm />;
}
