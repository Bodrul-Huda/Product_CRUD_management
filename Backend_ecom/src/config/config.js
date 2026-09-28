import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

dotenv.config({ path: path.resolve(currentDirectory, "../.env") });

const requiredEnvironmentVariables = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName],
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`,
  );
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default config;
