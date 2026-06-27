import React, { useEffect } from "react";
import { useTasks } from "../hooks/useTasks.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatsDashboard from "../components/StatsDashboard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TaskBoard from "../components/TaskBoard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import TaskDrawer from "../components/TaskDrawer.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import CommandPalette from "../components/CommandPalette.jsx";
import MeshGradientBackground from "../components/MeshGradientBackground.jsx";
import { FolderKanban, Terminal, LogOut } from "lucide-react";

const MainLayout = () => {
  const { logout, user } = useAuth();
  const {
    tasks,
    loading,
    isFirstLoad,
    error,
    loadData,
    filters,
    setActiveTask,
    setIsDrawerOpen,
    setIsCommandPaletteOpen
  } = useTasks();

  useEffect(() => {
    loadData();
  }, [loadData, filters.search, filters.status, filters.priority, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    const handleShortcut = (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.hasAttribute("contenteditable"))
      ) {
        return;
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setActiveTask({ isNew: true });
        setIsDrawerOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [setActiveTask, setIsDrawerOpen]);

  return (
    <div className="min-h-screen flex flex-col pb-16 relative">
      <MeshGradientBackground />

      <header className="sticky top-0 z-30 glass-panel py-2.5 px-6 mb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-accent)] rounded-xl text-[#0A0C0F] shadow-lg shadow-[var(--color-accent)]/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs font-black text-[var(--color-text)] tracking-widest uppercase leading-none">TaskTracker</h1>
              <span className="text-[8px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest block mt-1 font-mono">
                {user?.workspaceName || "Iteration Space"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-black/5 hover:border-zinc-800 text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-xl transition cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Search Actions</span>
              <kbd className="bg-zinc-950/5 border border-zinc-900/10 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ml-1">
                Ctrl+K
              </kbd>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-black/5 hover:border-zinc-800 text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-xl transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 flex-1 flex flex-col">
        <StatsDashboard />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          <div className="xl:col-span-3 flex flex-col">
            <SearchBar />
            {error && (
              <div className="p-4 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-semibold">
                {error}
              </div>
            )}
            {loading && isFirstLoad ? <LoadingSkeleton /> : <TaskBoard />}
          </div>
          
          <div className="xl:col-span-1 h-full xl:sticky xl:top-[90px]">
            <ActivityFeed />
          </div>
        </div>
      </main>

      <TaskDrawer />
      <DeleteModal />
      <CommandPalette />
    </div>
  );
};

export default MainLayout;
