import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().min(3).max(100),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100),
});

export const inviteMemberSchema =
  z.object({
    userId: z.number(),

    role: z.enum([
      "ADMIN",
      "MEMBER",
    ]),
  });