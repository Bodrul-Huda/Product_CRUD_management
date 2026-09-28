import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";
import authRouter from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", config.clientUrl],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);

app.get("/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    environment: config.env,
  });
});

app.use((request, response) => {
  response.status(404).json({ message: "Route not found" });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;
