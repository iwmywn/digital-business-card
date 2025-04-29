import { z } from "zod";

const tokenSchema = z.object({
  token: z
    .string()
    .length(44, { message: "Token must be exactly 44 characters long." }),
});

const basePasswordSchema = z
  .string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      "Password must be at least 8 characters long, include uppercase, lowercase, number and special character.",
  });

const baseEmailSchema = z.string().email({ message: "Invalid email address." });

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." }),
    email: baseEmailSchema,
    phone: z.string().min(10, { message: "Phone number must be valid." }),
    password: basePasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const signInSchema = z.object({
  email: baseEmailSchema,
  password: basePasswordSchema,
});

const resetPasswordSchema = z
  .object({
    password: basePasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const emailSchema = z.object({
  email: baseEmailSchema,
});

const contactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  companyName: z.string().min(1, { message: "Company name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  department: z.string().min(1, { message: "Please select a department." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z
    .string()
    .max(160, { message: "Bio must not exceed 160 characters." })
    .optional(),
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters long." })
    .optional(),
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters long." })
    .optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
});

const settingsSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password.",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  cardViewNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
});

export {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  emailSchema,
  tokenSchema,
  contactSchema,
  profileSchema,
  settingsSchema,
  notificationsSchema,
};
