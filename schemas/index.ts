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
      "Password must be at least 8 characters, include uppercase, lowercase, number and special character.",
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

const logInSchema = z.object({
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

export {
  signUpSchema,
  logInSchema,
  resetPasswordSchema,
  emailSchema,
  tokenSchema,
};
