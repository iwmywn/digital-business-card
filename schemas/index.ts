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
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters long." }),
    email: baseEmailSchema,
    phone: z
      .string()
      .regex(/^\+?[1-9][0-9]{7,14}$/, "Phone number must be valid."),
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
  company: z.string().min(1, { message: "Company name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Phone number must be valid.")
    .optional(),
  department: z.string().min(1, { message: "Please select a department." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const publicProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters long." }),
    profileImage: z.tuple([z.string(), z.string()]).optional(),
    coverImage: z.tuple([z.string(), z.string()]).optional(),
    gender: z.string().optional(),
    dateOfBirth: z.date().nullable().optional(),
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    bio: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { gender, dateOfBirth, jobTitle, company, website, bio } = data;

    if (
      gender &&
      !["male", "female", "non-binary", "prefer-not-to-say"].includes(
        gender.toLowerCase(),
      )
    ) {
      ctx.addIssue({
        path: ["gender"],
        message:
          "Gender must be one of 'male', 'female', 'non-binary or 'prefer-not-to-say'.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (dateOfBirth) {
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDifference = today.getMonth() - dateOfBirth.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        ctx.addIssue({
          path: ["dateOfBirth"],
          message: "You must be at least 13 years old.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (jobTitle && jobTitle.length > 50) {
      ctx.addIssue({
        path: ["jobTitle"],
        message: "Job title must not exceed 50 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (company && company.length > 100) {
      ctx.addIssue({
        path: ["company"],
        message: "Company name must not exceed 100 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (website && !/^https?:\/\/[^\s]+$/.test(website)) {
      ctx.addIssue({
        path: ["website"],
        message: "Website must be a valid URL.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (bio && bio.length > 160) {
      ctx.addIssue({
        path: ["bio"],
        message: "Bio must not exceed 160 characters.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const accountSchema = z
  .object({
    username: z.string().optional(),
    phone: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { username, phone, currentPassword, newPassword, confirmPassword } =
      data;

    if (username) {
      const match = username.match(/^[a-zA-Z0-9]+$/);
      if (!match) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "Username contains invalid characters.",
        });
      }
      if (username.length < 6) {
        ctx.addIssue({
          path: ["username"],
          message: "Username must be at least 6 characters long.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (username.length > 20) {
        ctx.addIssue({
          path: ["username"],
          message: "Username must be no more than 20 characters long.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (phone && !/^\+?[1-9][0-9]{7,14}$/.test(phone)) {
      ctx.addIssue({
        path: ["phone"],
        message: "Phone number must be valid.",
        code: z.ZodIssueCode.custom,
      });
    }

    const isChangingPassword =
      currentPassword || newPassword || confirmPassword;

    if (isChangingPassword) {
      if (!currentPassword) {
        ctx.addIssue({
          path: ["currentPassword"],
          message: "Current password is required.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!newPassword || newPassword.length < 8) {
        ctx.addIssue({
          path: ["newPassword"],
          message: "New password must be at least 8 characters long.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Please confirm your new password.",
          code: z.ZodIssueCode.custom,
        });
      } else if (newPassword !== confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

const notificationSettingsSchema = z.object({
  email: z.boolean(),
  cardView: z.boolean(),
  marketing: z.boolean(),
  security: z.boolean(),
});

const personalInfoSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters long." }),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    company: z.string().optional(),
    accreditations: z.string().optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { jobTitle, department, company, accreditations, headline, bio } =
      data;

    if (jobTitle && jobTitle.length > 50) {
      ctx.addIssue({
        path: ["jobTitle"],
        message: "Job title must not exceed 50 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (department && department.length > 50) {
      ctx.addIssue({
        path: ["department"],
        message: "Department must not exceed 50 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (company && company.length > 100) {
      ctx.addIssue({
        path: ["company"],
        message: "Company must not exceed 100 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (accreditations && accreditations.length > 50) {
      ctx.addIssue({
        path: ["accreditations"],
        message: "Accreditations must not exceed 50 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (headline && headline.length > 100) {
      ctx.addIssue({
        path: ["headline"],
        message: "Headline must not exceed 100 characters.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (bio && bio.length > 160) {
      ctx.addIssue({
        path: ["bio"],
        message: "Bio must not exceed 160 characters.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const cardSlugSchema = z
  .object({
    slug: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { slug } = data;

    if (slug) {
      const match = slug.match(/^[a-zA-Z0-9]+$/);
      if (!match) {
        ctx.addIssue({
          path: ["slug"],
          code: z.ZodIssueCode.custom,
          message: "Card slug contains invalid characters.",
        });
      }
      if (slug.length < 6) {
        ctx.addIssue({
          path: ["slug"],
          message: "Card slug must be at least 6 characters long.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (slug.length > 20) {
        ctx.addIssue({
          path: ["slug"],
          message: "Card slug must be no more than 20 characters long.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

const brandNameSchema = z
  .object({ brandName: z.string().optional() })
  .superRefine((data, ctx) => {
    const { brandName } = data;

    if (brandName && brandName.length > 100) {
      ctx.addIssue({
        path: ["brandName"],
        message: "Brand name must not exceed 100 characters.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  emailSchema,
  tokenSchema,
  contactSchema,
  publicProfileSchema,
  accountSchema,
  notificationSettingsSchema,
  personalInfoSchema,
  cardSlugSchema,
  brandNameSchema,
};
