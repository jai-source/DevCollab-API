import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation Failed",
        details: err.issues,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  if (
    err instanceof
      Prisma.PrismaClientInitializationError ||
    (err instanceof
      Prisma.PrismaClientKnownRequestError &&
      err.code === "ECONNREFUSED")
  ) {
    return res.status(503).json({
      success: false,
      error: {
        message:
          "Database unavailable",
      },
    });
  }

  if (
    err instanceof
      Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      error: {
        message:
          "A record with these values already exists",
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
};
