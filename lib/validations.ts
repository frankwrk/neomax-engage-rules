import { z } from "zod"
import { AGE_RANGES, COUNTIES, INTEREST_CATEGORIES } from "./constants"

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    mobileNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10,14}$/, "Please enter a valid mobile number"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    ageRange: z.enum(AGE_RANGES as [string, ...string[]], {
      errorMap: () => ({ message: "Please select an age range" }),
    }),
    county: z.enum(COUNTIES as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a county" }),
    }),
    interests: z
      .array(
        z.enum(INTEREST_CATEGORIES as [string, ...string[]], {
          errorMap: () => ({ message: "Please select valid interests" }),
        }),
      )
      .min(3, "Please select at least 3 interests")
      .max(10, "You can select up to 10 interests"),
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
})

export const competitionEntrySchema = z.object({
  answer: z.string().min(1, "Please provide an answer"),
})

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  mobileNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10,14}$/, "Please enter a valid mobile number"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  ageRange: z.enum(AGE_RANGES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an age range" }),
  }),
  county: z.enum(COUNTIES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a county" }),
  }),
  interests: z
    .array(
      z.enum(INTEREST_CATEGORIES as [string, ...string[]], {
        errorMap: () => ({ message: "Please select valid interests" }),
      }),
    )
    .min(3, "Please select at least 3 interests")
    .max(10, "You can select up to 10 interests"),
})

