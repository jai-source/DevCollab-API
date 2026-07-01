import { prisma } from "../config/prisma";
import { AppError } from "../utils/appError";

export async function createComment(
  taskId: number,
  userId: number,
  body: string
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
    throw new AppError(
      404,
      "Task not found"
    );
  }

  if (
    task.project.workspace.members.length ===
    0
  ) {
    throw new AppError(
      403,
      "You are not a member of this workspace"
    );
  }

  const comment =
    await prisma.comment.create({
      data: {
        body,
        taskId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  return comment;
}