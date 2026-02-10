import { z } from "zod";

/** Sanitize string: trim and limit length to prevent abuse */
const sanitizeStr = (max = 500) =>
  z
    .string()
    .trim()
    .min(1, "Required")
    .max(max)
    .transform((s) => s.replace(/[<>]/g, ""));

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email").toLowerCase(),
  name: z.string().trim().min(1, "Name required").max(100).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must include uppercase, lowercase, and number"
    ),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password required"),
});

export const courseSchema = z.object({
  title: sanitizeStr(200),
  description: z.union([sanitizeStr(2000), z.literal("")]).optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  published: z.boolean().optional().default(false),
});

export const moduleSchema = z.object({
  title: sanitizeStr(200),
  order: z.coerce.number().int().min(0).optional().default(0),
});

export const lessonSchema = z.object({
  title: sanitizeStr(200),
  content: z.union([sanitizeStr(10000), z.literal("")]).optional(),
  order: z.coerce.number().int().min(0).optional().default(0),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ModuleInput = z.infer<typeof moduleSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
