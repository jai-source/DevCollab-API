import "dotenv/config";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("Starting seed...");

  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@devcollab.com",
      passwordHash: "seed-password",
      role: "ADMIN",
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "DevCollab Workspace",
      slug: "devcollab-workspace",
    },
  });

  await prisma.workspaceMember.create({
    data: {
      userId: admin.id,
      workspaceId: workspace.id,
      role: "OWNER",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Initial Project",
      workspaceId: workspace.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Setup Backend",
        projectId: project.id,
      },
      {
        title: "Create Auth API",
        projectId: project.id,
      },
      {
        title: "Create Workspace API",
        projectId: project.id,
      },
      {
        title: "Create Task API",
        projectId: project.id,
      },
      {
        title: "Deploy Application",
        projectId: project.id,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
