import React, { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks.js";
import CustomSelect from "./CustomSelect.jsx";
import { Search, Plus, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const SearchBar = () => {
  const { filters, setFilters, setActiveTask, setIsDrawerOpen } = useTasks();
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: localSearch }));
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleCreateTask = () => {
    setActiveTask({ isNew: true });
    setIsDrawerOpen(true);
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const handleResetFilters = () => {
    setLocalSearch("");
    setFilters({
      search: "",
      status: "",
      priority: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Todo", label: "Todo" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
  ];

  return (
    <div className="flex flex-col gap-2.5 mb-3.5">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#23354C]/85" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search task name or description... (Ctrl+K)"
            className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25 placeholder-[#23354C]/70 font-semibold"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreateTask}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[#0A0C0F] rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[var(--color-accent)]/15 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-black/5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-text)] font-extrabold uppercase tracking-widest mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>

          <CustomSelect
            value={filters.status}
            onChange={(val) => handleFilterChange("status", val)}
            options={statusOptions}
            placeholder="All Statuses"
          />

          <CustomSelect
            value={filters.priority}
            onChange={(val) => handleFilterChange("priority", val)}
            options={priorityOptions}
            placeholder="All Priorities"
          />

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[9px] text-[var(--color-text)] hover:text-[var(--color-text)]/85 font-black uppercase tracking-widest px-2 py-1 underline transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-[var(--color-text)] font-extrabold uppercase tracking-widest mr-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
          </div>

          <CustomSelect
            value={filters.sortBy}
            onChange={(val) => handleFilterChange("sortBy", val)}
            options={sortOptions}
            placeholder="Date Created"
          />

          <button
            onClick={toggleSortOrder}
            className="glass-input rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold text-[#23354C] bg-[var(--color-surface)] focus:outline-none border border-black/10 cursor-pointer hover:bg-[var(--color-hover)]"
            title={filters.sortOrder === "desc" ? "Descending" : "Ascending"}
          >
            {filters.sortOrder === "desc" ? "DESC" : "ASC"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
