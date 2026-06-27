import { body, validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";

export const validateTask = [
  body("title")
    .if((value, { req }) => req.method === "POST" || req.body.title !== undefined)
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["Todo", "In Progress", "Completed"])
    .withMessage("Invalid status value"),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid priority value"),
  body("dueDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", errors.array());
    }
    next();
  },
];
