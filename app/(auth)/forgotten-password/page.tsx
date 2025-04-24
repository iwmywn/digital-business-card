import { ForgetPasswordForm } from "@/components/forget-password-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Forgotten password" };
}

export default function page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
