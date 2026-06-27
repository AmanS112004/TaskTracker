import Task from "../models/Task.js";

export const getTasks = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } }
    ];
  }

  let tasks = await Task.find(query);

  if (filters.sortBy) {
    const order = filters.sortOrder === "asc" ? 1 : -1;
    if (filters.sortBy === "priority") {
      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => {
        const valA = priorityMap[a.priority] || 0;
        const valB = priorityMap[b.priority] || 0;
        return (valA - valB) * order;
      });
    } else if (filters.sortBy === "dueDate") {
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate) - new Date(b.dueDate)) * order;
      });
    } else {
      tasks.sort((a, b) => {
        return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
      });
    }
  } else {
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return tasks;
};

export const getTaskById = async (id, userId) => {
  return await Task.findOne({ _id: id, user: userId });
};

export const createTask = async (userId, data) => {
  const task = new Task({ ...data, user: userId });
  return await task.save();
};

export const updateTask = async (id, userId, data) => {
  return await Task.findOneAndUpdate({ _id: id, user: userId }, data, { new: true, runValidators: true });
};

export const deleteTask = async (id, userId) => {
  return await Task.findOneAndDelete({ _id: id, user: userId });
};

export const getTaskStats = async (userId) => {
  const total = await Task.countDocuments({ user: userId });
  const completed = await Task.countDocuments({ user: userId, status: "Completed" });
  const inProgress = await Task.countDocuments({ user: userId, status: "In Progress" });
  const pending = await Task.countDocuments({ user: userId, status: "Todo" });
  return { total, completed, pending, inProgress };
};
