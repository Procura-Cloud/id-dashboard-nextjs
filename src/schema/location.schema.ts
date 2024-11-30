import { z } from "zod";

export const locationSchema = z.object({
  id: z.string().optional(),
  lineOne: z.string().min(1, "Line One is required"),
  lineTwo: z.string().optional(),
  lineThree: z.string().optional(),
  contact: z.string(),
});

export type LocationType = z.infer<typeof locationSchema>;
