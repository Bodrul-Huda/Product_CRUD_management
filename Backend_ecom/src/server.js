import app from "./app.js";
import config from "./config/config.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(`Server running on port ${config.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
