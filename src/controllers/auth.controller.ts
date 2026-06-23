import { Request, Response } from "express";
import { registerSchema } from "../modules/auth/auth.schema";
import { loginSchema } from "../modules/auth/auth.schema"
import { registerUser } from "../services/auth.service";
import { getUserById } from "../services/auth.service";
import { loginUser } from "../services/auth.service"
import { successResponse } from "../utils/apiResponse";
import { logoutUser } from "../services/auth.service";
import { logoutSchema } from "../modules/auth/auth.schema";
import { refreshSchema } from "../modules/auth/auth.schema";
import { refreshAccessToken } from "../services/auth.service";


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

export async function logout(
  req: Request,
  res: Response
) {
  const { refreshToken } =
    logoutSchema.parse(req.body);

  await logoutUser(refreshToken);

  return successResponse(
    res,
    200,
    "Logged out successfully"
  );
}

export async function refresh(
  req: Request,
  res: Response
) {
  const { refreshToken } =
    refreshSchema.parse(req.body);

  const accessToken =
    await refreshAccessToken(
      refreshToken
    );

  return successResponse(
    res,
    200,
    "Access token refreshed successfully",
    {
      accessToken,
    }
  );
}