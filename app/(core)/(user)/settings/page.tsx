import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AccountSetting } from "@/components/settings/account-form"
import { InformationSetting } from "@/components/settings/information-form"
import { NotificationSetting } from "@/components/settings/notification-form"

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage your account information, update your password, and configure notification preferences.",
}

export default function page() {
  return (
    <div className="space-y-6">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Public Profile</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InformationSetting />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Account</CardTitle>
          <CardDescription>
            Update your username and change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSetting />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Notification Preferences</CardTitle>
          <CardDescription>
            Configure how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSetting />
        </CardContent>
      </Card>
    </div>
  )
}
