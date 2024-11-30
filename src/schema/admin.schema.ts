import { z } from "zod";

export const adminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email."),
});

export type AdminType = z.infer<typeof adminSchema>;
