"use server"

import * as constants from "@/constants"
import { bugReportSchema, contactSchema } from "@/schemas"

import type { BugReportFormValues } from "@/components/support/bug-report-dialog"
import type { ContactFormValues } from "@/components/support/contact-dialog"
import { getContactCollection, getIssueCollection } from "@/lib/collections"
import { getUserById } from "@/lib/data"
import { session } from "@/lib/session"

export async function submitContact(values: ContactFormValues) {
  try {
    const { userId } = await session.user.get()

    if (!userId) {
      return { error: "Unauthorized! Please reload the page and try again." }
    }

    const existingUser = await getUserById(userId)

    if (!existingUser) return { error: "User not found!" }

    const parsedValues = contactSchema.safeParse(values)

    if (!parsedValues.success) return { error: "Invalid data provided!" }

    const contactCollection = await getContactCollection()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const submissionsToday = await contactCollection.countDocuments({
      userId,
      submittedAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    const planLimits: Record<string, number> = {
      free: constants.maxFreeCards,
      basic: constants.maxBasicCards,
      professional: constants.maxProfessionalCards,
    }

    if (submissionsToday >= planLimits[existingUser.currentPlan]) {
      return { error: "You have reached your daily submission limit!" }
    }

    const result = await contactCollection.insertOne({
      ...parsedValues.data,
      userId,
      submittedAt: new Date(),
    })

    if (!result.acknowledged)
      return { error: "Could not submit your message! Try again later." }

    return {
      success: "Your message has been sent. We'll get back to you soon.",
      error: undefined,
    }
  } catch (error) {
    console.error("Error sending contact form: ", error)
    return { error: "Failed to send contact form! Please try again later." }
  }
}

export async function submitIssue(values: BugReportFormValues) {
  try {
    const { userId } = await session.user.get()

    if (!userId) {
      return { error: "Unauthorized! Please reload the page and try again." }
    }

    const parsedValues = bugReportSchema.safeParse(values)

    if (!parsedValues.success) return { error: "Invalid data provided!" }

    const issueCollection = await getIssueCollection()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const submissionsToday = await issueCollection.countDocuments({
      userId,
      submittedAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    if (submissionsToday >= 30) {
      return { error: "You have reached your daily submission limit!" }
    }

    const result = await issueCollection.insertOne({
      ...parsedValues.data,
      userId,
      submittedAt: new Date(),
    })

    if (!result.acknowledged)
      return { error: "Could not submit your issue! Try again later." }

    return {
      success: "Your issue has been submitted. Thank you!",
      error: undefined,
    }
  } catch (error) {
    console.error("Error submitting report: ", error)
    return { error: "Failed to submit report! Please try again later." }
  }
}
