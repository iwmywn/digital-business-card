"use server";

import { BugReportFormValues } from "@/components/bug-report-dialog";
import { bugReportSchema, contactSchema } from "@/schemas";
import { getContactCollection, getIssueCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { ContactFormValues } from "@/components/contact-dialog";

export async function submitContact(values: ContactFormValues) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = contactSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const contactCollection = await getContactCollection();
    const result = await contactCollection.insertOne({
      ...parsedValues.data,
      userId,
      submittedAt: new Date(),
    });

    if (!result.acknowledged)
      return { error: "Could not submit your message! Try again later." };

    return {
      success: "Your message has been sent. We'll get back to you soon.",
      error: undefined,
    };
  } catch (error) {
    console.error("Error sending contact form: ", error);
    return { error: "Failed to send contact form! Please try again later." };
  }
}

export async function submitIssue(values: BugReportFormValues) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = bugReportSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const issueCollection = await getIssueCollection();
    const result = await issueCollection.insertOne({
      ...parsedValues.data,
      userId,
      submittedAt: new Date(),
    });

    if (!result.acknowledged)
      return { error: "Could not submit your issue! Try again later." };

    return {
      success: "Your issue has been submitted. Thank you!",
      error: undefined,
    };
  } catch (error) {
    console.error("Error submitting report: ", error);
    return { error: "Failed to submit report! Please try again later." };
  }
}
