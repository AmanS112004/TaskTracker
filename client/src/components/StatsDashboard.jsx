import React from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import { useCountUp } from "../hooks/useCountUp.js";

const MinimalMetric = ({ title, value }) => {
  const animatedValue = useCountUp(value);
  return (
    <div className="text-center space-y-0.5">
      <span className="text-[7px] uppercase font-bold tracking-tight text-[var(--color-text-secondary)]/80 block leading-tight">
        {title}
      </span>
      <h4 className="text-base sm:text-xl font-black text-[var(--color-text)] font-mono tracking-tighter leading-none">
        {animatedValue}
      </h4>
    </div>
  );
};

const StatsDashboard = () => {
  const { stats } = useTasks();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const animatedRate = useCountUp(completionRate);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4.5 py-4 px-5 bg-[var(--color-surface)] border border-white/5 rounded-2xl mb-4 shadow-xl relative overflow-hidden select-none">
      <div className="w-full md:flex-1 space-y-1">
        <span className="text-[7.5px] uppercase font-bold tracking-widest text-[var(--color-accent)] block">
          Workspace Overview
        </span>
        <h2 className="text-sm sm:text-base font-black text-[var(--color-text)] tracking-tight leading-tight max-w-md">
          Iteration progress stands at <span className="text-[var(--color-accent)] font-mono font-black">{animatedRate}%</span> completion.
        </h2>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3.5 md:pt-0 border-t md:border-t-0 border-black/5">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 flex-1 md:flex-none border-r border-black/5 pr-5">
          <MinimalMetric title="All" value={stats.total} />
          <MinimalMetric title="Todo" value={stats.pending} />
          <MinimalMetric title="In Progress" value={stats.inProgress} />
          <MinimalMetric title="Done" value={stats.completed} />
        </div>

        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 54 54">
            <circle
              cx="27"
              cy="27"
              r={radius}
              className="stroke-zinc-800/10"
              strokeWidth="3.5"
              fill="transparent"
            />
            <motion.circle
              cx="27"
              cy="27"
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
            <span className="text-[10px] font-black text-[var(--color-text)] leading-none">{stats.completed}</span>
            <span className="text-[5px] text-[var(--color-text-secondary)] uppercase font-bold tracking-widest mt-0.5">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
