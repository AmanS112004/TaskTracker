import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { PlusCircle, Edit2, CheckCircle2, Trash2, RotateCcw, Clock } from "lucide-react";

const ActivityFeed = () => {
  const { activities, clearActivities } = useTasks();

  const getActivityIcon = (type) => {
    switch (type) {
      case "created":
        return <PlusCircle className="w-3 h-3 text-[var(--color-primary)]" />;
      case "updated":
        return <Edit2 className="w-3 h-3 text-[var(--color-text-secondary)]" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />;
      case "deleted":
        return <Trash2 className="w-3 h-3 text-rose-600" />;
      case "restored":
        return <RotateCcw className="w-3 h-3 text-indigo-600" />;
      default:
        return <Clock className="w-3 h-3 text-[var(--color-text-secondary)]" />;
    }
  };

  const formatRelativeTime = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="glass-card rounded-3xl border border-black/5 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Activity Log</h4>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="text-[9px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-bold tracking-widest uppercase transition cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative flex-1 max-h-[350px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-secondary)]/50 text-[10px] uppercase font-bold tracking-wider">
            No logged items
          </div>
        ) : (
          <div className="relative pl-4 space-y-5">
            <div className="absolute left-[7px] top-1.5 bottom-1.5 w-[1px] bg-black/10" />
            <AnimatePresence initial={false}>
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="relative flex gap-3 text-[11px] items-start"
                >
                  <div className="absolute -left-[13px] top-1 p-0.5 bg-[var(--color-bg)] border border-black/5 rounded-full flex items-center justify-center z-10">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex-1 min-w-0 pl-1.5">
                    <p className="text-[var(--color-text-secondary)] font-medium leading-tight">
                      <span className="font-bold text-[var(--color-text)] capitalize mr-1">{act.type}</span>
                      task <span className="text-[var(--color-text)] font-semibold">"{act.taskTitle}"</span>
                    </p>
                    <span className="text-[8px] font-mono text-[var(--color-text-secondary)]/80 mt-1 block">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
