import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number(),

  DATABASE_URL: z.string(),

  REDIS_URL: z.string(),

  JWT_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
