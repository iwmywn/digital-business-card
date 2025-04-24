import { ForgetPasswordForm } from "@/components/forget-password-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Forgotten password" };
}

export default function page() {
  return <ForgetPasswordForm />;
}
