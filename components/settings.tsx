"use client";

import { InformationForm } from "@/components/information-form";
import { AccountForm } from "@/components/account-form";
import { NotificationSettings } from "@/components/notification-settings";
import { useUser } from "@/lib/swr";
import { useEffect } from "react";
import { toast } from "sonner";
import { SettingsSkeleton } from "@/components/skeletons";

export function Settings() {
  const { isUserLoading, isUserError } = useUser();

  useEffect(() => {
    if (isUserError) toast.error(isUserError);
  }, [isUserError]);

  if (isUserLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-2">
      <InformationForm />
      <AccountForm />
      <NotificationSettings />
    </div>
  );
}
