import { z } from "zod";

export const hrSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email."),
});

export type HRType = z.infer<typeof hrSchema>;
