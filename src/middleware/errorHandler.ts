import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

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

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
};