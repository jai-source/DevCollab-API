import {
  Priority,
  TaskStatus,
  WorkspaceRole,
} from "@prisma/client";

import { prisma } from "../config/prisma";

async function getProjectWithMember(
  projectId: number,
  userId: number
) {
  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        workspace: {
          include: {
            members: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new Error("Project not found");
  }

  const membership =
    project.workspace.members[0];

  if (!membership) {
    throw new Error(
      "You are not a member of this workspace"
    );
  }

  return {
    project,
    membership,
  };
}

export async function createTask(
  projectId: number,
  userId: number,
  data: {
    title: string;
    description?: string;
    priority?: Priority;
    assigneeId?: number;
    dueDate?: string;
  }
) {
  const { project, membership } =
    await getProjectWithMember(
      projectId,
      userId
    );

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new Error(
      "Only OWNER or ADMIN can create tasks"
    );
  }

  if (data.assigneeId) {
    const assignee =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: data.assigneeId,
            workspaceId:
              project.workspaceId,
          },
        },
      });

    if (!assignee) {
      throw new Error(
        "Assignee is not a member of this workspace"
      );
    }
  }

  const task =
    await prisma.task.create({
      data: {
        title: data.title,
        description:
          data.description,

        priority:
          data.priority ??
          Priority.MEDIUM,

        dueDate: data.dueDate
          ? new Date(data.dueDate)
          : undefined,

        assigneeId:
          data.assigneeId,

        createdById: userId,

        projectId,
      },
    });

  // TODO
  // enqueue task_assigned email

  return task;
}

export async function getProjectTasks(
  projectId: number,
  userId: number
) {
  await getProjectWithMember(
    projectId,
    userId
  );

  return prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTaskById(
  taskId: number,
  userId: number
) {
  const task =
    await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        project: {
          include: {
            workspace: {
              include: {
                members: {
                  where: {
                    userId,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  if (
    task.project.workspace.members.length ===
    0
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  return task;
}

export async function updateTask(
  taskId: number,
  userId: number,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: number;
    dueDate?: string;
  }
) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const membership =
    task.project.workspace.members[0];

  if (!membership) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.description !== undefined) {
    updateData.description =
      data.description;
  }

  if (data.priority !== undefined) {
    updateData.priority =
      data.priority;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate =
      new Date(data.dueDate);
  }

  // Any workspace member may update status
  if (data.status !== undefined) {
    updateData.status =
      data.status;

    // TODO
    // enqueue notification if status becomes DONE
  }

  // Only OWNER / ADMIN can change assignee
  if (
    data.assigneeId !== undefined
  ) {
    if (
      membership.role !==
        WorkspaceRole.OWNER &&
      membership.role !==
        WorkspaceRole.ADMIN
    ) {
      throw new Error(
        "Only OWNER or ADMIN can change assignee"
      );
    }

    const assignee =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId:
              data.assigneeId,
            workspaceId:
              task.project
                .workspaceId,
          },
        },
      });

    if (!assignee) {
      throw new Error(
        "Assignee is not a workspace member"
      );
    }

    updateData.assigneeId =
      data.assigneeId;
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: updateData,
  });
}

export async function deleteTask(
  taskId: number,
  userId: number
) {
  const task =
    await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: {
          include: {
            workspace: {
              include: {
                members: {
                  where: {
                    userId,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const membership =
    task.project.workspace.members[0];

  if (!membership) {
    throw new Error(
      "Unauthorized"
    );
  }

  const isOwnerOrAdmin =
    membership.role ===
      WorkspaceRole.OWNER ||
    membership.role ===
      WorkspaceRole.ADMIN;

  const isCreator =
    task.createdById ===
    userId;

  if (
    !isOwnerOrAdmin &&
    !isCreator
  ) {
    throw new Error(
      "You are not allowed to delete this task"
    );
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
}