import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be 2 characters long"),
    email: z.email("invalid email id"),
    password: z.string().min(8,"password must be 8 charecters long"),
});

export const loginSchema = z.object({
    email: z.email("invalid email id"),
    password: z.string().min(1),
})

export type RegisterInput = z.infer< typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

