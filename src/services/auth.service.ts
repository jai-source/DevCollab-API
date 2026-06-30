import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { RegisterInput } from "../modules/auth/auth.schema";
import { LoginInput } from "../modules/auth/auth.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AppError } from "../utils/appError";

//Register User
export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      409,
      "Email already registered"
    );
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
    throw new AppError(
      401,
      "Invalid credentials"
    );
  }

  const passwordMatch =
    await bcrypt.compare(
      data.password,
      user.passwordHash
    );

  if (!passwordMatch) {
    throw new AppError(
      401,
      "Invalid credentials"
    );
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

  if (!user) {
    throw new AppError(
      404,
      "User not found"
    );
  }

  return user;
}

export async function logoutUser(
  refreshToken: string
) {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });
  return true;
}

export async function refreshAccessToken(
  refreshToken: string
) {
  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

  if (!storedToken) {
    throw new AppError(
      401,
      "Refresh token not found"
    );
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    }).catch(() => {});
    throw new AppError(
      401,
      "Refresh token expired"
    );
  }

  let decoded: jwt.JwtPayload | string;
  try {
    decoded = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new AppError(
      401,
      "Invalid refresh token"
    );
  }

  if (typeof decoded === "string" || !decoded.sub) {
    throw new AppError(
      401,
      "Invalid refresh token"
    );
  }

  const accessToken = generateAccessToken(
    Number(decoded.sub)
  );

  return accessToken;
}
