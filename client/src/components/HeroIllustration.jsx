import React from "react";
import { motion } from "framer-motion";

const HeroIllustration = () => {
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1.5, ease: "easeInOut" } 
    }
  };

  const cardVariants = {
    hidden: { scale: 0, opacity: 0, y: 10 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.25 + 0.8,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  return (
    <div className="w-full max-w-lg aspect-square flex items-center justify-center relative overflow-hidden select-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <clipPath id="illustration-reveal-mask">
            <motion.circle
              cx="200"
              cy="200"
              r="0"
              animate={{ r: 240 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
          </clipPath>
        </defs>

        <g clipPath="url(#illustration-reveal-mask)">
          <motion.rect
            x="30"
            y="30"
            width="340"
            height="340"
            rx="24"
            stroke="rgba(0, 0, 0, 0.04)"
            strokeWidth="2.5"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />

          <motion.rect
            x="145"
            y="65"
            width="110"
            height="150"
            rx="12"
            stroke="#E26343"
            strokeWidth="3.5"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M175,65 L175,55 C175,52 177,50 180,50 L220,50 C223,50 225,52 225,55 L225,65"
            stroke="#E26343"
            strokeWidth="3.5"
            strokeLinecap="round"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.line
            x1="170"
            y1="95"
            x2="230"
            y2="95"
            stroke="#5D594D"
            strokeWidth="3"
            strokeLinecap="round"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.line
            x1="170"
            y1="120"
            x2="215"
            y2="120"
            stroke="#5D594D"
            strokeWidth="3"
            strokeLinecap="round"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.line
            x1="170"
            y1="145"
            x2="200"
            y2="145"
            stroke="#5D594D"
            strokeWidth="3"
            strokeLinecap="round"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />

          <motion.g
            variants={cardVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          >
            <rect
              x="45"
              y="235"
              width="95"
              height="110"
              rx="16"
              fill="#EFE5C8"
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="2"
            />
            <circle
              cx="65"
              cy="255"
              r="6"
              fill="#E26343"
            />
            <line
              x1="80"
              y1="255"
              x2="120"
              y2="255"
              stroke="#5D594D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="280"
              x2="120"
              y2="280"
              stroke="#5D594D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="300"
              x2="105"
              y2="300"
              stroke="#5D594D"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.g
            variants={cardVariants}
            custom={2}
            initial="hidden"
            animate="visible"
          >
            <rect
              x="152"
              y="235"
              width="95"
              height="110"
              rx="16"
              fill="#D8D0BE"
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="2"
            />
            <circle
              cx="172"
              cy="255"
              r="6"
              fill="#334A6A"
            />
            <line
              x1="187"
              y1="255"
              x2="227"
              y2="255"
              stroke="#5D594D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="167"
              y1="280"
              x2="227"
              y2="280"
              stroke="#334A6A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.g
            variants={cardVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            <rect
              x="260"
              y="235"
              width="95"
              height="110"
              rx="16"
              fill="#EFE5C8"
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="2"
            />
            <circle
              cx="280"
              cy="255"
              r="6"
              fill="#5D594D"
            />
            <line
              x1="295"
              y1="255"
              x2="335"
              y2="255"
              stroke="#5D594D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="275"
              y1="280"
              x2="335"
              y2="280"
              stroke="#5D594D"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.path
            d="M 140 290 Q 200 210 262 290"
            stroke="rgba(226, 99, 67, 0.3)"
            strokeWidth="3"
            strokeDasharray="4 4"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          />
        </g>
      </svg>
    </div>
  );
};

export default HeroIllustration;
