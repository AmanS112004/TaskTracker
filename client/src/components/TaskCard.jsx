import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { getRelativeDueDate } from "../utils/dateFormatter.js";
import { theme } from "../config/theme.js";
import { Calendar, Trash2, Edit2 } from "lucide-react";

const TaskCard = ({ task }) => {
  const { updateExistingTask, setActiveTask, setIsDrawerOpen, setTaskToDelete, setIsDeleteModalOpen } = useTasks();

  const cardRef = useRef(null);
  const floatRef = useRef(null);
  const ghostRef = useRef(null);
  const scrollRef = useRef(null);

  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
  });

  const priorityConfig = theme.priority[task.priority] || theme.priority.Medium;
  const { text: dueText, colorClass: dueColor } = getRelativeDueDate(task.dueDate);

  const stopScroll = () => {
    if (scrollRef.current) {
      clearInterval(scrollRef.current);
      scrollRef.current = null;
    }
  };

  const runAutoScroll = (clientY, deltaY) => {
    const edge = 85;
    const speed = 8;
    if (clientY < edge && deltaY < -10) {
      if (!scrollRef.current) scrollRef.current = setInterval(() => window.scrollBy(0, -speed), 16);
    } else if (window.innerHeight - clientY < edge && deltaY > 10) {
      if (!scrollRef.current) scrollRef.current = setInterval(() => window.scrollBy(0, speed), 16);
    } else {
      stopScroll();
    }
  };

  const showFloat = (x, y) => {
    if (!floatRef.current) return;
    floatRef.current.style.display = "flex";
    floatRef.current.style.left = `${x}px`;
    floatRef.current.style.top = `${y}px`;
  };

  const hideFloat = () => {
    if (floatRef.current) floatRef.current.style.display = "none";
    if (ghostRef.current) ghostRef.current.style.display = "none";
    if (cardRef.current) {
      cardRef.current.style.opacity = "";
      cardRef.current.style.background = "";
      cardRef.current.style.border = "";
      cardRef.current.style.boxShadow = "";
    }
  };

  const activateDrag = (rect) => {
    dragState.current.active = true;
    dragState.current.width = rect.width;
    dragState.current.height = rect.height;

    if (floatRef.current) {
      floatRef.current.style.width = `${rect.width}px`;
      floatRef.current.style.height = `${rect.height}px`;
    }

    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
    }

    if (ghostRef.current) {
      ghostRef.current.style.display = "block";
    }
  };

  useEffect(() => {
    return () => stopScroll();
  }, []);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();

    dragState.current = {
      active: false,
      startX: touch.clientX,
      startY: touch.clientY,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const ds = dragState.current;

    const deltaX = touch.clientX - ds.startX;
    const deltaY = touch.clientY - ds.startY;
    const dist = Math.hypot(deltaX, deltaY);

    if (!ds.active) {
      if (dist < 8) return;
      const rect = cardRef.current.getBoundingClientRect();
      activateDrag(rect);
    }

    const newX = touch.clientX - ds.offsetX;
    const newY = touch.clientY - ds.offsetY;

    showFloat(newX, newY);
    runAutoScroll(touch.clientY, deltaY);
  };

  const handleTouchEnd = (e) => {
    stopScroll();
    const ds = dragState.current;
    if (!ds.active) return;

    const touch = e.changedTouches[0];
    hideFloat();
    dragState.current.active = false;

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const col = el ? el.closest("[data-column-status]") : null;
    if (col) {
      const newStatus = col.getAttribute("data-column-status");
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

  const cardInner = (
    <>
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${priorityConfig.accentClass}`} />

      {task.status === "Completed" && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-[var(--color-accent)]/15 pointer-events-none z-10"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%)" }}
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border font-mono ${priorityConfig.badgeClass}`}>
            {task.priority}
          </span>
          <span className="text-[9px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest font-mono">
            {task.status}
          </span>
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
    </>
  );

  return (
    <>
      <motion.div
        ref={cardRef}
        draggable
        onDragStart={handleDragStart}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
        whileHover={{
          y: -4,
          scale: 1.01,
          transition: { type: "spring", stiffness: 450, damping: 20 },
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="relative pl-4 pr-3.5 py-4 rounded-2xl bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-white/5 hover:border-zinc-800 cursor-grab active:cursor-grabbing transition-colors duration-300 group flex flex-col justify-between min-h-[115px] select-none overflow-hidden"
        style={{
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 8px 30px rgba(0, 0, 0, 0.2)",
          touchAction: "none",
        }}
      >
        {cardInner}
      </motion.div>

      <div
        ref={ghostRef}
        style={{ display: "none" }}
        className="rounded-2xl border-2 border-dashed border-black/15 bg-black/5 min-h-[115px] w-full pointer-events-none"
      />

      <div
        ref={floatRef}
        style={{
          display: "none",
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          transform: "scale(1.04)",
          transformOrigin: "top left",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.05)",
          background: "var(--color-surface)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
        className="pl-4 pr-3.5 py-4 flex flex-col justify-between overflow-hidden"
      >
        {cardInner}
      </div>
    </>
  );
};

export default TaskCard;
