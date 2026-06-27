export const getRelativeDueDate = (dateStr) => {
  if (!dateStr) return { text: "", colorClass: "" };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const options = { month: "short", day: "numeric" };
  const formatted = new Date(dateStr).toLocaleDateString("en-US", options);
  
  if (diffDays === 0) {
    return { text: "Due Today", colorClass: "text-amber-850 bg-amber-500/10 border-amber-500/25" };
  } else if (diffDays === 1) {
    return { text: "Tomorrow", colorClass: "text-emerald-850 bg-emerald-500/10 border-emerald-500/25" };
  } else if (diffDays === -1) {
    return { text: "Yesterday", colorClass: "text-rose-850 bg-rose-500/10 border-rose-500/25 font-semibold" };
  } else if (diffDays < -1) {
    return { text: `Overdue by ${Math.abs(diffDays)}d`, colorClass: "text-rose-850 bg-rose-500/10 border-rose-500/25 font-semibold animate-pulse" };
  } else if (diffDays > 1 && diffDays <= 7) {
    return { text: `${diffDays} days left`, colorClass: "text-[var(--color-text-secondary)] bg-[var(--color-text-secondary)]/10 border-[var(--color-text-secondary)]/20" };
  }
  
  return { text: formatted, colorClass: "text-[var(--color-text-secondary)] bg-[var(--color-text-secondary)]/10 border-[var(--color-text-secondary)]/20" };
};
