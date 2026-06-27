import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({ value, onChange, options, placeholder, fullWidth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left select-none ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#23354C] font-bold bg-[var(--color-surface)] border border-black/10 cursor-pointer flex items-center justify-between gap-1.5 hover:bg-[var(--color-hover)] transition-colors ${fullWidth ? "w-full text-sm" : "min-w-[125px]"}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#23354C]/80 transition-transform duration-250 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className={`absolute left-0 mt-1.5 rounded-2xl bg-[var(--color-surface)] border border-black/10 shadow-2xl p-1.5 z-40 ${fullWidth ? "w-full" : "w-44"}`}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.015\'/%3E%3C/svg%3E")'
            }}
          >
            <div className="flex flex-col gap-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
                      isSelected
                        ? "bg-[var(--color-accent)] text-[#F2EEE9]"
                        : "text-[#23354C] hover:bg-[var(--color-hover)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
