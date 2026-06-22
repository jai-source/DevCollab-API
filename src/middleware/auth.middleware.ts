import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { errorResponse } from "../utils/apiResponse";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return errorResponse(
      res,
      401,
      "Access token required"
    );
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(
      res,
      401,
      "Invalid token"
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );

    if (typeof decoded === "string") {
      return errorResponse(
        res,
        401,
        "Invalid or expired token"
      );
    }

    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId)) {
      return errorResponse(
        res,
        401,
        "Invalid or expired token"
      );
    }

    (req as any).user = {
      id: userId,
    };

    next();
  } catch {
    return errorResponse(
      res,
      401,
      "Invalid or expired token"
    );
  }
}
