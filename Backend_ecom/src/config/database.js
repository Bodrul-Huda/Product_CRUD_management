import mongoose from "mongoose";
import config from "./config.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export { connectDatabase, disconnectDatabase };
