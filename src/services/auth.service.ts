import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { RegisterInput } from "../modules/auth/auth.schema";

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    12
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  return user;
}