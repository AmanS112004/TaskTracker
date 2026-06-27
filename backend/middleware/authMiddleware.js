import { verifyToken } from "../utils/cryptoHelper.js";
import User from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "No authentication token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return errorResponse(res, 401, "Invalid or expired authentication token");
  }

  try {
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 401, "User no longer exists");
    }
    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 500, "Authentication server error");
  }
};

export default authMiddleware;
