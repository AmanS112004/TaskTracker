import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { Search, Plus, Trash2, RefreshCw, X, FolderKanban } from "lucide-react";

const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setFilters,
    setActiveTask,
    setIsDrawerOpen,
    clearActivities,
    tasks
  } = useTasks();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
  }, [isCommandPaletteOpen]);

  const baseCommands = [
    {
      id: "new-task",
      title: "Create New Task",
      icon: Plus,
      category: "Actions",
      action: () => {
        setActiveTask({ isNew: true });
        setIsDrawerOpen(true);
      },
    },
    {
      id: "clear-activity",
      title: "Clear Activity Feed",
      icon: Trash2,
      category: "System",
      action: () => {
        clearActivities();
      },
    },
    {
      id: "filter-todo",
      title: "Filter Status: Todo",
      icon: FolderKanban,
      category: "Filters",
      action: () => {
        setFilters((prev) => ({ ...prev, status: "Todo" }));
      },
    },
    {
      id: "filter-progress",
      title: "Filter Status: In Progress",
      icon: FolderKanban,
      category: "Filters",
      action: () => {
        setFilters((prev) => ({ ...prev, status: "In Progress" }));
      },
    },
    {
      id: "filter-completed",
      title: "Filter Status: Completed",
      icon: FolderKanban,
      category: "Filters",
      action: () => {
        setFilters((prev) => ({ ...prev, status: "Completed" }));
      },
    },
    {
      id: "reset-filters",
      title: "Reset Board Filters",
      icon: RefreshCw,
      category: "Filters",
      action: () => {
        setFilters({
          search: "",
          status: "",
          priority: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        });
      },
    },
  ];

  const filteredCommands = baseCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  const matchedTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 3)
    .map((task) => ({
      id: `task-${task._id}`,
      title: `Go to: ${task.title}`,
      icon: FolderKanban,
      category: "Tasks",
      action: () => {
        setActiveTask(task);
        setIsDrawerOpen(true);
      },
    }));

  const allItems = [...filteredCommands, ...matchedTasks];

  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isCommandPaletteOpen || allItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        allItems[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [isCommandPaletteOpen, selectedIndex, allItems, setIsCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-xl bg-[var(--color-surface)] border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.02\'/%3E%3C/svg%3E")'
            }}
          >
            <div className="flex items-center px-4 py-3.5 border-b border-zinc-900/60 gap-3">
              <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search tasks..."
                className="w-full bg-transparent text-[var(--color-text)] text-sm focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="p-1 hover:bg-zinc-900/20 rounded-lg text-slate-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto p-2">
              {allItems.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)] text-xs font-bold uppercase tracking-wider">
                  No matching commands
                </div>
              ) : (
                allItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsCommandPaletteOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold select-none transition ${
                        isSelected
                          ? "bg-[var(--color-accent)] text-[#0A0C0F]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#0A0C0F]" : "text-slate-500"}`} />
                        <span>{item.title}</span>
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-[#0A0C0F]/15 text-[#0A0C0F] font-black"
                            : "bg-[var(--color-hover)] text-[var(--color-text-secondary)] border border-white/5"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-950/5 border-t border-zinc-900/60 flex justify-between items-center text-[10px] text-[var(--color-text-secondary)]/80 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Enter</span>
              </div>
              <span>Esc Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
