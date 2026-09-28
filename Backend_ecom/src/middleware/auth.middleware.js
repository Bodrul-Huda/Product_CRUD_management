import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/config.js";

const authenticateUser = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.accessTokenSecret);

    if (!decodedToken.userId) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    const user = await User.findById(decodedToken.userId).select(
      "-password -refreshTokenHash",
    );

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    request.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    next(error);
  }
};

export default authenticateUser;
