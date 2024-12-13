import { z } from "zod";

export const locationSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Office Name is required."),
  preFormattedAddress: z.string().min(1, "Office Address is required."),
});

export type LocationType = z.infer<typeof locationSchema>;
