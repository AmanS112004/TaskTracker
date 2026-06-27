import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { AlertTriangle, X } from "lucide-react";

const DeleteModal = () => {
  const { isDeleteModalOpen, setIsDeleteModalOpen, taskToDelete, deleteExistingTask, tasks } = useTasks();

  if (!isDeleteModalOpen) return null;

  const targetTask = tasks.find(t => t._id === taskToDelete);

  const handleConfirm = async () => {
    if (taskToDelete) {
      await deleteExistingTask(taskToDelete);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsDeleteModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-[var(--color-surface)] border border-white/5 rounded-2xl p-6 shadow-2xl z-10"
        >
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition p-1 hover:bg-[var(--color-hover)] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-800 rounded-xl border border-rose-500/25">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-md font-bold text-[var(--color-text)]">Delete Task</h3>
              <p className="text-[var(--color-text-secondary)] text-xs mt-2 leading-relaxed">
                Are you sure you want to delete <span className="text-[var(--color-text)] font-semibold">"{targetTask?.title || "this task"}"</span>? This action can be undone from the toast notification.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-xl text-xs font-bold hover:bg-[var(--color-hover)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-[#E85234] hover:bg-[#E85234]/90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteModal;
