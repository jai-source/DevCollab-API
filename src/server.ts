import app from "./app";
import env from "./config/env";
import { prisma } from "./config/prisma";

const PORT = env.PORT;

export let server:
  | ReturnType<typeof app.listen>
  | undefined;

async function startServer() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    server = app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );

    server.on("error", (error) => {
      console.error(
        "Failed to start server",
        error
      );
      process.exit(1);
    });
  } catch (error) {
    await prisma.$disconnect().catch(() => {
      return undefined;
    });

    console.error(
      "Failed to connect to the database",
      error
    );
    process.exit(1);
  }
}

void startServer();
