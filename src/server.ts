import app from "./app";
import env from "./config/env";

const PORT = env.PORT;

export const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server", error);
});
