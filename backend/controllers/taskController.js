import * as taskService from "../services/taskService.js";
import { successResponse } from "../utils/apiResponse.js";

export const getTasks = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const tasks = await taskService.getTasks(req.user._id, filters);
    return successResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats(req.user._id);
    return successResponse(res, 200, "Stats retrieved successfully", stats);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, "Task retrieved successfully", task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    return successResponse(res, 201, "Task created successfully", task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, "Task updated successfully", task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user._id);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 200, "Task deleted successfully", task);
  } catch (error) {
    next(error);
  }
};
