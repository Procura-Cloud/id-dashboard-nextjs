import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email."),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

export type VendorType = z.infer<typeof vendorSchema>;
