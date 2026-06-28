import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import CustomSelect from "./CustomSelect.jsx";
import { X, Calendar, AlertCircle, Trash2, ArrowRight } from "lucide-react";

const TaskDrawer = () => {
  const {
    activeTask,
    isDrawerOpen,
    setIsDrawerOpen,
    createNewTask,
    updateExistingTask,
    setTaskToDelete,
    setIsDeleteModalOpen
  } = useTasks();

  const isEdit = activeTask && !activeTask.isNew;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    }
  });

  useEffect(() => {
    if (activeTask) {
      reset({
        title: activeTask.title || "",
        description: activeTask.description || "",
        status: activeTask.status || "Todo",
        priority: activeTask.priority || "Medium",
        dueDate: activeTask.dueDate ? new Date(activeTask.dueDate).toISOString().split("T")[0] : "",
      });
    }
  }, [activeTask, reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };

    if (isEdit) {
      await updateExistingTask(activeTask._id, formattedData);
    } else {
      await createNewTask(formattedData);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = () => {
    if (activeTask && activeTask._id) {
      setTaskToDelete(activeTask._id);
      setIsDeleteModalOpen(true);
    }
  };

  const drawerVariants = {
    hidden: {
      clipPath: "circle(0% at 100% 0%)",
      transition: { type: "spring", stiffness: 260, damping: 32 }
    },
    visible: {
      clipPath: "circle(150% at 100% 0%)",
      transition: { type: "spring", stiffness: 180, damping: 25 }
    }
  };

  const statusOptions = [
    { value: "Todo", label: "Todo" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" }
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
  ];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-screen max-w-md bg-[var(--color-surface)] border-l border-white/5 shadow-2xl flex flex-col"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.02\'/%3E%3C/svg%3E")'
              }}
            >
              <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                  {isEdit ? "Edit Task" : "New Task"}
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-[var(--color-text-secondary)] font-mono">
                    Workspace
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  {isEdit && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 text-[var(--color-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/5 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Title</label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "Title is required",
                      maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
                    })}
                    placeholder="Task name"
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 placeholder-zinc-700 font-medium"
                  />
                  {errors.title && (
                    <span className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Description</label>
                  <textarea
                    rows={4}
                    {...register("description", {
                      maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
                    })}
                    placeholder="Describe this task..."
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 resize-none placeholder-zinc-700"
                  />
                  {errors.description && (
                    <span className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.description.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Status</label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={statusOptions}
                          placeholder="Todo"
                          fullWidth
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Priority</label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={priorityOptions}
                          placeholder="Medium"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-text)]" /> Due Date
                  </label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 [color-scheme:light] font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2.5 border border-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 disabled:opacity-50 text-[#0A0C0F] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[var(--color-accent)]/15 cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Save Details"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDrawer;
