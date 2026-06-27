import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import apiLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/tasks", apiLimiter, taskRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
