import { useState, useEffect } from "react";

export const useCountUp = (endVal, duration = 500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startVal = count;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      const currentVal = Math.round(startVal + (endVal - startVal) * progressRatio);
      setCount(currentVal);
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endVal, duration]);

  return count;
};
