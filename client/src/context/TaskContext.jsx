import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import * as api from "../services/api.js";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("taskActivities");
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("taskFilters");
    return saved ? JSON.parse(saved) : { search: "", status: "", priority: "", sortBy: "createdAt", sortOrder: "desc" };
  });

  const [activeTask, setActiveTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const lastDeletedTaskRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("taskActivities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = useCallback((type, taskTitle) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      taskTitle,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  }, []);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getTaskStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTasks = useCallback(async (customFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTasks(customFilters);
      if (res.data.success) {
        setTasks(res.data.data);
        setIsFirstLoad(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadData = useCallback(async () => {
    await fetchTasks();
    await fetchStats();
  }, [fetchTasks, fetchStats]);

  const createNewTask = async (taskData) => {
    setLoading(true);
    try {
      const res = await api.createTask(taskData);
      if (res.data.success) {
        const newTask = res.data.data;
        setTasks(prev => [newTask, ...prev]);
        addActivity("created", newTask.title);
        await fetchStats();
        toast.success("Task created successfully");
        return newTask;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateExistingTask = async (id, updateData) => {
    const originalTasks = [...tasks];
    const originalStats = { ...stats };
    
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...updateData } : t));
    
    try {
      const res = await api.updateTask(id, updateData);
      if (res.data.success) {
        const updated = res.data.data;
        
        const oldTask = originalTasks.find(t => t._id === id);
        if (oldTask && oldTask.status !== updated.status) {
          if (updated.status === "Completed") {
            addActivity("completed", updated.title);
          } else {
            addActivity("updated", updated.title);
          }
        } else {
          addActivity("updated", updated.title);
        }
        
        await fetchStats();
        if (activeTask && activeTask._id === id) {
          setActiveTask(updated);
        }
        return updated;
      }
    } catch (err) {
      setTasks(originalTasks);
      setStats(originalStats);
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const undoDelete = async () => {
    if (!lastDeletedTaskRef.current) return;
    const taskToRestore = lastDeletedTaskRef.current;
    lastDeletedTaskRef.current = null;
    
    try {
      const res = await api.createTask({
        title: taskToRestore.title,
        description: taskToRestore.description,
        status: taskToRestore.status,
        priority: taskToRestore.priority,
        dueDate: taskToRestore.dueDate,
      });
      
      if (res.data.success) {
        const restored = res.data.data;
        setTasks(prev => [restored, ...prev]);
        addActivity("restored", restored.title);
        await fetchStats();
        toast.success("Task restored");
      }
    } catch (err) {
      toast.error("Failed to restore task");
    }
  };

  const deleteExistingTask = async (id) => {
    const taskToDeleteObj = tasks.find(t => t._id === id);
    if (!taskToDeleteObj) return;

    lastDeletedTaskRef.current = taskToDeleteObj;
    
    const originalTasks = [...tasks];
    const originalStats = { ...stats };

    setTasks(prev => prev.filter(t => t._id !== id));
    
    try {
      const res = await api.deleteTask(id);
      if (res.data.success) {
        addActivity("deleted", taskToDeleteObj.title);
        await fetchStats();
        
        if (activeTask && activeTask._id === id) {
          setIsDrawerOpen(false);
          setActiveTask(null);
        }
        
        toast((t) => (
          <span className="flex items-center gap-3 text-sm text-slate-200">
            Task deleted
            <button
              onClick={() => {
                toast.dismiss(t.id);
                undoDelete();
              }}
              className="px-2 py-1 bg-[#E85234] hover:bg-[#E85234]/90 text-white rounded text-xs transition font-semibold"
            >
              Undo
            </button>
          </span>
        ), {
          duration: 5000,
          style: {
            background: "#181825",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }
        });
      }
    } catch (err) {
      setTasks(originalTasks);
      setStats(originalStats);
      toast.error("Failed to delete task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        isFirstLoad,
        error,
        activities,
        filters,
        activeTask,
        isDrawerOpen,
        isDeleteModalOpen,
        taskToDelete,
        isCommandPaletteOpen,
        setFilters,
        setActiveTask,
        setIsDrawerOpen,
        setIsDeleteModalOpen,
        setTaskToDelete,
        setIsCommandPaletteOpen,
        fetchTasks,
        fetchStats,
        loadData,
        createNewTask,
        updateExistingTask,
        deleteExistingTask,
        undoDelete,
        clearActivities: () => setActivities([]),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
