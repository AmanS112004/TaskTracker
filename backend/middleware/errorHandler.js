import { errorResponse } from "../utils/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  return errorResponse(res, statusCode, message);
};

export default errorHandler;
