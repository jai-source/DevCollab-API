import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number(),

  DATABASE_URL: z.string(),

  REDIS_URL: z.string(),

  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_SECRET: z.string().trim().min(1).optional(),
  JWT_REFRESH_SECRET: z.string().trim().min(1).optional(),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),
}).transform((values) => ({
  ...values,
  JWT_ACCESS_SECRET: values.JWT_ACCESS_SECRET ?? values.JWT_SECRET,
  JWT_REFRESH_SECRET: values.JWT_REFRESH_SECRET ?? values.JWT_SECRET,
}));

const env = envSchema.parse(process.env);

export default env;
