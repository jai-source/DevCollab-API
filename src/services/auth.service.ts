import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { RegisterInput } from "../modules/auth/auth.schema";
import { LoginInput } from "../modules/auth/auth.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";


//Register User
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


//Login User
export async function loginUser(
  data: LoginInput
) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch =
    await bcrypt.compare(
      data.password,
      user.passwordHash
    );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken =
    generateAccessToken(user.id);

  const refreshToken =
    generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function getUserById(
  userId: number
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

  return user;
}