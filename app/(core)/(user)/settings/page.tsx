import type { Metadata } from "next";
import { InformationForm } from "@/components/information-form";
import { AccountForm } from "@/components/account-form";
import { Notifications } from "@/components/notifications";

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage your account information, update your password, and configure notification preferences.",
};

export default function page() {
  return (
    <>
      <div className="space-y-2">
        <InformationForm />
        <AccountForm />
        <Notifications />
      </div>
    </>
  );
}
