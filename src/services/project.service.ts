import { WorkspaceRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/appError";

export async function createProject(
  workspaceId: number,
  userId: number,
  name: string,
  description?: string
) {
  const membership =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

  if (!membership) {
    throw new AppError(404, "Workspace not found");
  }

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      403,
      "Not authorized to create project"
    );
  }

  const project =
    await prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
      },
    });

  return project;
}

export async function getWorkspaceProjects(
  workspaceId: number,
  userId: number
) {
  const membership =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

  if (!membership) {
    throw new AppError(404, "Workspace not found");
  }

  return prisma.project.findMany({
    where: {
      workspaceId,
    },
  });
}

export async function getProjectById(
  projectId: number,
  userId: number
) {
  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  return project;
}

export async function updateProject(
  projectId: number,
  userId: number,
  name: string
) {
  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId,
              role: {
                in: [
                  WorkspaceRole.OWNER,
                  WorkspaceRole.ADMIN,
                ],
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new AppError(
      404,
      "Project not found or unauthorized"
    );
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
    },
  });
}

export async function deleteProject(
  projectId: number,
  userId: number
) {
  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId,
              role: {
                in: [
                  WorkspaceRole.OWNER,
                  WorkspaceRole.ADMIN,
                ],
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new AppError(
      404,
      "Project not found or unauthorized"
    );
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}