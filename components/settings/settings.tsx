"use client";

import { InformationForm } from "@/components/settings/information-form";
import { AccountForm } from "@/components/settings/account-form";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { useUser } from "@/lib/swr";
import { useEffect } from "react";
import { toast } from "sonner";
import { SettingsSkeleton } from "@/components/skeletons";

export function Settings() {
  const { isUserLoading, isUserError } = useUser();

  useEffect(() => {
    if (isUserError && !isUserLoading) toast.error(isUserError);
  }, [isUserError, isUserLoading]);

  if (isUserLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <InformationForm />
      <AccountForm />
      <NotificationSettings />
    </div>
  );
}
