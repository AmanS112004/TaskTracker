import User from "../models/User.js";
import { hashPassword, verifyPassword, signToken } from "../utils/cryptoHelper.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const register = async (req, res) => {
  const { name, email, password, workspaceName } = req.body;

  if (!name || !email || !password || !workspaceName) {
    return errorResponse(res, 400, "All fields are required");
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, "User with this email already exists");
    }

    const hashedPassword = hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      workspaceName
    });

    const token = signToken({ userId: user._id });

    return successResponse(res, 201, "Registration successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspaceName: user.workspaceName
      }
    });
  } catch (err) {
    return errorResponse(res, 500, "Server error during registration");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Email and password are required");
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const token = signToken({ userId: user._id });

    return successResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspaceName: user.workspaceName
      }
    });
  } catch (err) {
    return errorResponse(res, 500, "Server error during login");
  }
};
