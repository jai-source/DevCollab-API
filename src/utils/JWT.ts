import jwt from "jsonwebtoken";
import env from "../config/env";

function buildJwtOptions(
  userId: number,
  expiresIn: string
): jwt.SignOptions {
  return {
    subject: String(userId),
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  };
}

export function generateAccessToken(userId: number) {
  return jwt.sign(
    {},
    env.JWT_ACCESS_SECRET,
    buildJwtOptions(
      userId,
      env.JWT_ACCESS_EXPIRES_IN
    )
  );
}

export function generateRefreshToken(userId: number) {
  return jwt.sign(
    {},
    env.JWT_REFRESH_SECRET,
    buildJwtOptions(
      userId,
      env.JWT_REFRESH_EXPIRES_IN
    )
  );
}
