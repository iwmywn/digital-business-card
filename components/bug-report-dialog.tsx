"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FormButton } from "@/components/form-button";
import { bugReportSchema } from "@/schemas";
import { submitIssue } from "@/actions/support-requests";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type BugReportFormValues = z.infer<typeof bugReportSchema>;

export function BugReportDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: "",
      type: "bug",
      description: "",
      steps: "",
    },
  });

  async function onSubmit(values: BugReportFormValues) {
    const { success, error } = await submitIssue(values);

    if (error || !success) {
      toast.error(error);
    } else {
      form.reset();
      setOpen(false);
      toast.success(success);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2">Report an issue</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Report an Issue</DialogTitle>
          <DialogDescription>
            Help us improve by reporting bugs or suggesting new features.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Brief summary of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="type">Report Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Please describe the issue in detail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="steps">Steps To Reproduce</FormLabel>
                  <FormControl>
                    <Textarea
                      id="steps"
                      placeholder="If applicable, list the steps to reproduce the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    For bug reports, please provide steps to reproduce if
                    possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormButton
              isSubmitting={form.formState.isSubmitting}
              text="Submit report"
              className="w-full"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
