import express from "express";
import * as taskController from "../controllers/taskController.js";
import { validateTask } from "../validators/taskValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.get("/:id", taskController.getTaskById);
router.post("/", validateTask, taskController.createTask);
router.put("/:id", validateTask, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
