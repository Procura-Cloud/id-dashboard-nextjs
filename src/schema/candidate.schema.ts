import { z } from "zod";

export const candidateSchema = z.object({
  id: z.string().uuid().optional(),
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
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "This field is required",
    }),
});

export type CandidateType = z.infer<typeof candidateSchema>;
