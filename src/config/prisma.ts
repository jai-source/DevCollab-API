import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "./env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

if(process.env.NODE_ENV === "production" && !process.env.DATABASE_URL?.includes("connection limit")){
  console.warn("Warning: Database connection pool size is using the default value");
}

export const prisma = new PrismaClient({
  adapter,
});
