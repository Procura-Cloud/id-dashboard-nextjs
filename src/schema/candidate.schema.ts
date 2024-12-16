import { z } from "zod";

export const candidateSchema = z.object({
  id: z.number().optional(),
  type: z.string().default("NEW_APPLICATION"),
  name: z.string().min(1, "Name is required."),
  email: z.string().email(),
  photoUrl: z.string().optional(),
  status: z.string().optional(),
  stage: z.string().optional(),
  employeeID: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  comments: z.string().optional(),
  location: z
    .object({
      value: z.string(),
      label: z.string(),
      id: z.string().optional().nullable(),
      slug: z.string().optional().nullable(),
    })
    .nullable()
    .optional(),
});

export type CandidateType = z.infer<typeof candidateSchema>;

export const lostAndFoundSchema = z.object({
  id: z.number().optional(),
  type: z.string().default("LOST_AND_FOUND"),
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .email()
    .min(1, "Email is required.")
    .refine((email) => email.endsWith("@nielseniq.com"), {
      message: "Email must belong to the nielseniq.com domain",
    }),
  photoUrl: z.string().optional(),
  status: z.string().optional(),
  stage: z.string().optional(),
  employeeID: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  comments: z.string().optional(),
  location: z
    .object({
      value: z.string(),
      label: z.string(),
      id: z.string().optional().nullable(),
      slug: z.string().optional().nullable(),
    })
    .required(),
});

export type LostAndFoundType = z.infer<typeof lostAndFoundSchema>;
