import { prisma } from "../config/prisma";
import { generateSlug } from "../utils/slug";
import { WorkspaceRole } from "../generated/prisma/enums";

export async function createWorkspace(
  name: string,
  userId: number
) {
  const workspace =
    await prisma.workspace.create({
      data: {
        name,
        slug: "temp-slug",
      },
    });

  const slug = `${generateSlug(name)}-${
    workspace.id
  }`;

  const updatedWorkspace =
    await prisma.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        slug,
      },
    });

  await prisma.workspaceMember.create({
    data: {
      workspaceId:
        updatedWorkspace.id,
      userId,
      role: "OWNER",
    },
  });

  return updatedWorkspace;
}

export async function getUserWorkspaces(
  userId: number
) {
  return prisma.workspaceMember.findMany({
    where: {
      userId,
    },

    include: {
      workspace: true,
    },
  });
}

export async function getWorkspaceById(
  workspaceId: number,
  userId: number
) {
  const workspace =
    await prisma.workspace.findFirst({
      where: {
        id: workspaceId,

        members: {
          some: {
            userId,
          },
        },
      },

      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

  if (!workspace) {
    throw new Error(
      "Workspace not found"
    );
  }

  return workspace;
}







export async function updateWorkspace(
  workspaceId: number,
  userId: number,
  name: string
) {
  // Check if the user is a member of the workspace
  const membership =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

  // User is not a member
  if (!membership) {
    throw new Error("Workspace not found");
  }

  // User doesn't have permission
  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new Error(
      "You are not allowed to update this workspace"
    );
  }

  const slug = `${generateSlug(name)}-${workspaceId}`;

  const workspace =
    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name,
        slug,
      },
    });

  return workspace;
}


export async function deleteWorkspace(
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
    throw new Error("Workspace not found");
  }

  if (
    membership.role !==
    WorkspaceRole.OWNER
  ) {
    throw new Error(
      "Only the owner can delete the workspace"
    );
  }

  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
}


export async function inviteMember(
  workspaceId: number,
  inviterId: number,
  userId: number,
  role: WorkspaceRole
) {
  const inviter =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: inviterId,
          workspaceId,
        },
      },
    });

  if (!inviter) {
    throw new Error(
      "Workspace not found"
    );
  }

  if (
    inviter.role !==
      WorkspaceRole.OWNER &&
    inviter.role !==
      WorkspaceRole.ADMIN
  ) {
    throw new Error(
      "Not authorized"
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const existing =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

  if (existing) {
    throw new Error(
      "User already a member"
    );
  }

  return prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId,
      role,
    },
  });
}


export async function removeMember(
  workspaceId: number,
  requesterId: number,
  userId: number
) {
  const requester =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: requesterId,
          workspaceId,
        },
      },
    });

  if (!requester) {
    throw new Error(
      "Workspace not found"
    );
  }

  if (
    requester.role !==
      WorkspaceRole.OWNER &&
    requester.role !==
      WorkspaceRole.ADMIN
  ) {
    throw new Error(
      "Not authorized"
    );
  }

  const member =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

  if (!member) {
    throw new Error(
      "Member not found"
    );
  }

  if (
    member.role ===
    WorkspaceRole.OWNER
  ) {
    throw new Error(
      "Owner cannot be removed"
    );
  }

  await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
}