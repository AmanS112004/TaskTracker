import React from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { useCountUp } from "../hooks/useCountUp.js";

const MinimalMetric = ({ title, value }) => {
  const animatedValue = useCountUp(value);
  return (
    <div className="space-y-0.5">
      <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--color-text-secondary)] block">{title}</span>
      <h4 className="text-xl sm:text-2xl font-black text-[var(--color-text)] font-mono tracking-tighter leading-none">
        {animatedValue}
      </h4>
    </div>
  );
};

const StatsDashboard = () => {
  const { stats } = useTasks();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const animatedRate = useCountUp(completionRate);

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="flex flex-row justify-between items-center gap-6 py-3 px-6 bg-[var(--color-surface)] border border-white/5 rounded-2xl mb-4 shadow-xl relative overflow-hidden select-none">
      <div className="flex-1 space-y-0.5">
        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--color-accent)]">Workspace Overview</span>
        <h2 className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-tight max-w-md">
          Iteration progress stands at <span className="text-[var(--color-accent)] font-mono font-black">{animatedRate}%</span> completion.
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-5 items-center border-r border-zinc-800/15 pr-6">
          <MinimalMetric title="All" value={stats.total} />
          <MinimalMetric title="Todo" value={stats.pending} />
          <MinimalMetric title="In Progress" value={stats.inProgress} />
          <MinimalMetric title="Done" value={stats.completed} />
        </div>

        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="stroke-zinc-800/10"
              strokeWidth="3.5"
              fill="transparent"
            />
            <motion.circle
              cx="30"
              cy="30"
              r={radius}
              className="stroke-[var(--color-accent)]"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
            <span className="text-[11px] font-black text-[var(--color-text)] leading-none">{stats.completed}</span>
            <span className="text-[6px] text-[var(--color-text-secondary)] uppercase font-bold tracking-widest mt-0.5">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
