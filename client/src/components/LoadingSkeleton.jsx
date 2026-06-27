import React from "react";

const SkeletonCard = () => {
  return (
    <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-3 bg-slate-800 rounded w-1/6" />
      </div>
      <div className="h-5 bg-slate-800 rounded w-3/4" />
      <div className="space-y-1">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-slate-800 rounded-lg" />
          <div className="h-6 w-6 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["Todo", "In Progress", "Completed"].map((col) => (
        <div key={col} className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-800 rounded w-1/3 animate-pulse" />
            <div className="h-5 w-8 bg-slate-800 rounded-full animate-pulse" />
          </div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
