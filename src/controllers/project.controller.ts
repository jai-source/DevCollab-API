import {Request , Response} from "express";
import { AppError } from "../utils/appError";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../modules/project/project.schema";
import {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service";
import { successResponse } from "../utils/apiResponse";



export async function create(
  req: Request,
  res: Response
) {
  const { name } =
    createProjectSchema.parse(req.body);

  const workspaceId = Number(req.params.workspaceId);
  if (isNaN(workspaceId)) {
    throw new AppError(400, "Workspace ID is required");
  }

  const project =
    await createProject(
      workspaceId,
      (req as any).user.id,
      name
    );

  return successResponse(
    res,
    201,
    "Project created successfully",
    project
  );
}

export async function getProjects(
  req: Request,
  res: Response
) {
  const workspaceId = Number(req.params.workspaceId);
  if (isNaN(workspaceId)) {
    throw new AppError(400, "Workspace ID is required");
  }

  const projects =
    await getWorkspaceProjects(
      workspaceId,
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Projects fetched successfully",
    projects
  );
}

export async function getProject(
  req: Request,
  res: Response
) {
  const project =
    await getProjectById(
      Number(req.params.projectId),
      (req as any).user.id
    );

  return successResponse(
    res,
    200,
    "Project fetched successfully",
    project
  );
}

export async function update(
  req: Request,
  res: Response
) {
  const { name } =
    updateProjectSchema.parse(
      req.body
    );

  const project =
    await updateProject(
      Number(req.params.projectId),
      (req as any).user.id,
      name
    );

  return successResponse(
    res,
    200,
    "Project updated successfully",
    project
  );
}

export async function remove(
  req: Request,
  res: Response
) {
  await deleteProject(
    Number(req.params.projectId),
    (req as any).user.id
  );

  return res.status(204).send();
}