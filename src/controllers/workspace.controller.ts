import { Request, Response } from "express";
import { createWorkspaceSchema } from "../modules/workspace/workspace.schema";
import { createWorkspace } from "../services/workspace.service";
import { successResponse } from "../utils/apiResponse";
import { getUserWorkspaces } from "../services/workspace.service";
import { getWorkspaceById } from "../services/workspace.service";
import { updateWorkspaceSchema } from "../modules/workspace/workspace.schema";
import { updateWorkspace } from "../services/workspace.service";
import { deleteWorkspace } from "../services/workspace.service";
import { inviteMember } from "../services/workspace.service";
import { inviteMemberSchema } from "../modules/workspace/workspace.schema";
import { removeMember } from "../services/workspace.service";
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
export async function getWorkspaces(
  req: Request,
  res: Response
) {
  const workspaces =
    await getUserWorkspaces(
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Workspaces fetched successfully",
    workspaces
  );
}

export async function getWorkspace(
  req: Request,
  res: Response
) {
  const workspace =
    await getWorkspaceById(
      Number(req.params.workspaceId),
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Workspace fetched successfully",
    workspace
  );
}


export async function update(
  req: Request,
  res: Response
) {
  const { name } =
    updateWorkspaceSchema.parse(
      req.body
    );

  const workspace =
    await updateWorkspace(
      Number(req.params.workspaceId),
      (req as any).user.id,
      name
    );

  return successResponse(
    res,
    200,
    "Workspace updated successfully",
    workspace
  );
}


export async function remove(
  req: Request,
  res: Response
) {
  await deleteWorkspace(
    Number(req.params.workspaceId),
    (req as any).user.id
  );

  return res.status(204).send();
}

export async function invite(
  req: Request,
  res: Response
) {
  const { userId, role } =
    inviteMemberSchema.parse(
      req.body
    );

  const member =
    await inviteMember(
      Number(req.params.workspaceId),
      (req as any).user.id,
      userId,
      role
    );

  return successResponse(
    res,
    201,
    "Member invited",
    member
  );
}

export async function removeMemberController(
  req: Request,
  res: Response
) {
  await removeMember(
    Number(req.params.workspaceId),
    (req as any).user.id,
    Number(req.params.userId)
  );

  return res.status(204).send();
}