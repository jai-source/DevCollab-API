import { Request, Response } from "express";
import { registerSchema } from "../modules/auth/auth.schema";
import { loginSchema } from "../modules/auth/auth.schema"
import { registerUser } from "../services/auth.service";
import { getUserById } from "../services/auth.service";
import { loginUser } from "../services/auth.service"
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

export async function login(
  req: Request,
  res: Response
) {
  const validatedData =
    loginSchema.parse(req.body);

  const result =
    await loginUser(validatedData);

  return successResponse(
    res,
    200,
    "Login successful",
    {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      accessToken:
        result.accessToken,
      refreshToken:
        result.refreshToken,
    }
  );
}



export async function getCurrentUser(
  req: Request,
  res: Response
) {
  const user = await getUserById(
    (req as any).user.id
  );

  return successResponse(
    res,
    200,
    "User fetched successfully",
    user
  );
}