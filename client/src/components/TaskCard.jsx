import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { getRelativeDueDate } from "../utils/dateFormatter.js";
import { theme } from "../config/theme.js";
import { Calendar, Trash2, Edit2 } from "lucide-react";

const TaskCard = ({ task }) => {
  const { updateExistingTask, setActiveTask, setIsDrawerOpen, setTaskToDelete, setIsDeleteModalOpen } = useTasks();
  
  const cardRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const priorityConfig = theme.priority[task.priority] || theme.priority.Medium;
  const { text: dueText, colorClass: dueColor } = getRelativeDueDate(task.dueDate);

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleAutoScroll = (clientY) => {
    const edgeSize = 100;
    const speed = 10;

    if (clientY < edgeSize) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, -speed);
        }, 16);
      }
    } else if (window.innerHeight - clientY < edgeSize) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, speed);
        }, 16);
      }
    } else {
      stopAutoScroll();
    }
  };

  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    cardRef.current.dataset.startX = touch.clientX;
    cardRef.current.dataset.startY = touch.clientY;
    setIsTouchDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isTouchDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - parseFloat(cardRef.current.dataset.startX);
    const deltaY = touch.clientY - parseFloat(cardRef.current.dataset.startY);
    setTouchOffset({ x: deltaX, y: deltaY });
    handleAutoScroll(touch.clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isTouchDragging) return;
    setIsTouchDragging(false);
    setTouchOffset({ x: 0, y: 0 });
    stopAutoScroll();

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const columnEl = element ? element.closest("[data-column-status]") : null;
    if (columnEl) {
      const newStatus = columnEl.getAttribute("data-column-status");
      if (newStatus && newStatus !== task.status) {
        updateExistingTask(task._id, { status: newStatus });
      }
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest(".action-btn")) return;
    setActiveTask(task);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setTaskToDelete(task._id);
    setIsDeleteModalOpen(true);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      draggable
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 450, damping: 20 } 
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="relative pl-4 pr-3.5 py-4 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-white/5 hover:border-zinc-800 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-300 group flex flex-col justify-between min-h-[115px] select-none"
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 8px 30px rgba(0, 0, 0, 0.2)",
        transform: isTouchDragging 
          ? `translate3d(${touchOffset.x}px, ${touchOffset.y}px, 0)` 
          : "none",
        zIndex: isTouchDragging ? 50 : "auto",
        position: isTouchDragging ? "relative" : "static",
        touchAction: "none"
      }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${priorityConfig.accentClass}`} />

      {task.status === "Completed" && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-[var(--color-accent)]/15 pointer-events-none z-10"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%)"
          }}
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border font-mono ${priorityConfig.badgeClass}`}>
            {task.priority}
          </span>
          <span className="text-[9px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest font-mono">{task.status}</span>
        </div>

        <h4 className="text-xs font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors leading-snug line-clamp-1">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-3.5">
        <div>
          {task.dueDate ? (
            <div className={`flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border font-mono ${dueColor}`}>
              <Calendar className="w-2.5 h-2.5" />
              <span>{dueText}</span>
            </div>
          ) : (
            <span className="text-[8px] text-zinc-700/80 font-bold uppercase tracking-widest font-mono">No due date</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCardClick}
            className="action-btn p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/5 rounded-lg transition cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="action-btn p-1 text-[var(--color-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
