export const theme = {
  colors: {
    primary: "var(--color-primary)",
    accent: "var(--color-accent)",
    bg: "var(--color-bg)",
    surface: "var(--color-surface)",
    text: "var(--color-text-secondary)",
    muted: "var(--color-dark)",
  },
  priority: {
    High: {
      accentClass: "bg-[#E26343]",
      badgeClass: "bg-[#E26343]/15 text-[#E26343] border-[#E26343]/25",
    },
    Medium: {
      accentClass: "bg-[#5D594D]",
      badgeClass: "bg-[#5D594D]/15 text-[#5D594D] border-[#5D594D]/25",
    },
    Low: {
      accentClass: "bg-[#334A6A]",
      badgeClass: "bg-[#334A6A]/15 text-[#334A6A] border-[#334A6A]/25",
    },
  },
  status: {
    Todo: {
      iconColor: "text-[#5D594D]",
      bgClass: "bg-[#5D594D]/5",
    },
    "In Progress": {
      iconColor: "text-[#E26343]",
      bgClass: "bg-[#E26343]/5",
    },
    Completed: {
      iconColor: "text-[#334A6A]",
      bgClass: "bg-[#334A6A]/5",
    },
  },
};
