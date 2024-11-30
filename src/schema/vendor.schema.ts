import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email."),
  phoneNumber: z.string().optional(),
});

export type VendorType = z.infer<typeof vendorSchema>;
