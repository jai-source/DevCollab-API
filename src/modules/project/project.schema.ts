import { z } from "zod";

export const createProjectSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3)
      .max(100),
  });

export const updateProjectSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3)
      .max(100),
  });
