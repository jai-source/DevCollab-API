import { prisma } from "../config/prisma";
import { generateSlug } from "../utils/slug";

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