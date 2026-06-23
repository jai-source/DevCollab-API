import { Request, Response } from "express";
import { createWorkspaceSchema } from "../modules/workspace/workspace.schema";
import { createWorkspace } from "../services/workspace.service";
import { successResponse } from "../utils/apiResponse";

export async function create(
  req: Request,
  res: Response
) {
  const { name } =
    createWorkspaceSchema.parse(
      req.body
    );

  const workspace =
    await createWorkspace(
      name,
      (req as any).user.id
    );

  return successResponse(
    res,
    201,
    "Workspace created",
    workspace
  );
}