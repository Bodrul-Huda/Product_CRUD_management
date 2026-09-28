import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import config from "../config/config.js";

export const register = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "A user with this email already exists",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return response.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        success: false,
        message: "A user with this email already exists",
        data: null,
      });
    }

    next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const tokenPayload = { userId: user._id };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: config.env === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (request, response, next) => {
  const refreshToken = request.cookies?.refreshToken;

  if (!refreshToken) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, config.refreshTokenSecret);

    if (!decodedToken.userId) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user || !user.refreshTokenHash) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const accessToken = generateAccessToken({ userId: user._id });

    return response.status(200).json({
      success: true,
      message: "Access token refreshed",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    next(error);
  }
};

export const logout = async (request, response, next) => {
  try {
    const user = await User.findById(request.user._id);

    if (user) {
      user.refreshTokenHash = null;
      await user.save();
    }

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: config.env === "production" ? "none" : "lax",
    });

    return response.status(200).json({
      success: true,
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (request, response, next) => {
  try {
    return response.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: request.user,
    });
  } catch (error) {
    next(error);
  }
};
