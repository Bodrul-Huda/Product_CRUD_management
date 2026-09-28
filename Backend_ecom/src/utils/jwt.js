import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiresIn || "15m",
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiresIn || "7d",
  });
