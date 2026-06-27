import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { getRelativeDueDate } from "../utils/dateFormatter.js";
import { theme } from "../config/theme.js";
import { Calendar, Trash2, Edit2 } from "lucide-react";

const TaskCard = ({ task }) => {
  const { updateExistingTask, setActiveTask, setIsDrawerOpen, setTaskToDelete, setIsDeleteModalOpen } = useTasks();
  
  const cardRef = useRef(null);
  const floatingRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [cardDims, setCardDims] = useState({ width: 0, height: 0 });
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const priorityConfig = theme.priority[task.priority] || theme.priority.Medium;
  const { text: dueText, colorClass: dueColor } = getRelativeDueDate(task.dueDate);

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleAutoScroll = (clientY, deltaY) => {
    const edgeSize = 85;
    const speed = 8;

    if (clientY < edgeSize && deltaY < -10) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, -speed);
        }, 16);
      }
    } else if (window.innerHeight - clientY < edgeSize && deltaY > 10) {
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
    const rect = cardRef.current.getBoundingClientRect();
    
    cardRef.current.dataset.startX = touch.clientX;
    cardRef.current.dataset.startY = touch.clientY;
    cardRef.current.dataset.dragOffsetX = touch.clientX - rect.left;
    cardRef.current.dataset.dragOffsetY = touch.clientY - rect.top;
    
    setTouchPos({ x: rect.left, y: rect.top });
    setCardDims({ width: rect.width, height: rect.height });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const startX = parseFloat(cardRef.current.dataset.startX || touch.clientX);
    const startY = parseFloat(cardRef.current.dataset.startY || touch.clientY);
    
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!isTouchDragging) {
      if (distance > 8) {
        setIsTouchDragging(true);
      } else {
        return;
      }
    }
    
    const dragOffsetX = parseFloat(cardRef.current.dataset.dragOffsetX);
    const dragOffsetY = parseFloat(cardRef.current.dataset.dragOffsetY);
    
    const newX = touch.clientX - dragOffsetX;
    const newY = touch.clientY - dragOffsetY;
    
    if (floatingRef.current) {
      floatingRef.current.style.left = `${newX}px`;
      floatingRef.current.style.top = `${newY}px`;
    }
    
    handleAutoScroll(touch.clientY, deltaY);
  };

  const handleTouchEnd = (e) => {
    stopAutoScroll();
    if (!isTouchDragging) return;
    setIsTouchDragging(false);

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

  const renderCardContents = (isGhost = false) => {
    return (
      <>
        <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${priorityConfig.accentClass}`} />

        {task.status === "Completed" && !isGhost && (
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
      </>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      layout={!isTouchDragging}
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
      className={`relative rounded-2xl cursor-grab active:cursor-grabbing transition-colors duration-300 group flex flex-col justify-between min-h-[115px] select-none ${
        isTouchDragging 
          ? "overflow-visible bg-transparent border-transparent" 
          : "pl-4 pr-3.5 py-4 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-white/5 hover:border-zinc-800 overflow-hidden"
      }`}
      style={{
        boxShadow: isTouchDragging 
          ? "none" 
          : "inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 8px 30px rgba(0, 0, 0, 0.2)",
        touchAction: "none",
        transform: isTouchDragging ? "none" : undefined
      }}
    >
      {isTouchDragging ? (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-black/15 bg-black/5 rounded-2xl pointer-events-none z-0" />
          <div
            ref={floatingRef}
            style={{
              position: "fixed",
              left: `${touchPos.x}px`,
              top: `${touchPos.y}px`,
              width: `${cardDims.width}px`,
              height: `${cardDims.height}px`,
              transform: "scale(1.04)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
              background: "var(--color-surface)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "16px",
              zIndex: 9999,
              pointerEvents: "none"
            }}
            className="pl-4 pr-3.5 py-4 flex flex-col justify-between overflow-hidden"
          >
            {renderCardContents(true)}
          </div>
        </>
      ) : (
        renderCardContents(false)
      )}
    </motion.div>
  );
};

export default TaskCard;
