import { Request, Response } from "express";
import { registerSchema } from "../modules/auth/auth.schema";
import { registerUser } from "../services/auth.service";
import { successResponse } from "../utils/apiResponse";

export async function register(
  req: Request,
  res: Response
) {
  const validatedData = registerSchema.parse(
    req.body
  );

  const user = await registerUser(
    validatedData
  );

  return successResponse(
    res,
    201,
    "user registered succesfully..",
    {
        id: user.id,
        name: user.name,
        email: user.email,
    }
  );

}