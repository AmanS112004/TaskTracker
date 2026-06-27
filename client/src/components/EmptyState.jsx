import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#13161B] rounded-2xl border border-white/5 max-w-lg mx-auto mt-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
          <defs>
            <mask id="svg-reveal-mask">
              <motion.rect
                x="0"
                y="0"
                width="0"
                height="120"
                fill="white"
                animate={{ width: 120 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </mask>
          </defs>
          <g mask="url(#svg-reveal-mask)">
            <rect
              x="25"
              y="20"
              width="70"
              height="80"
              rx="14"
              fill="none"
              stroke="#E57F84"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <line
              x1="45"
              y1="45"
              x2="75"
              y2="45"
              stroke="#8B95A7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="45"
              y1="60"
              x2="75"
              y2="60"
              stroke="#8B95A7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="45"
              y1="75"
              x2="65"
              y2="75"
              stroke="#8B95A7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect
              x="50"
              y="12"
              width="20"
              height="12"
              rx="4"
              fill="#2F5061"
            />
          </g>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="text-lg font-bold text-[#F7F7F8] mb-2 tracking-tight">You're all caught up</h3>
        <p className="text-[#8B95A7] text-xs mb-8 max-w-xs mx-auto leading-relaxed">
          Create your first task to get started on organizing your workspace workflow.
        </p>
        <motion.button
          whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 450, damping: 20 } }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E57F84] hover:bg-[#E57F84]/90 text-[#0A0C0F] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#E57F84]/15 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmptyState;
