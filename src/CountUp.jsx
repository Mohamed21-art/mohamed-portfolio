import { useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 2500, suffix = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const observer = new IntersectionObserver(([entry]) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        if (ref.current) ref.current.textContent = end;
        return;
      }
      
      if (entry.isIntersecting) {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ultra smooth exponential ease-out
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          if (ref.current) {
            ref.current.textContent = Math.round(easeProgress * end);
          }
          if (progress < 1) {
            animationFrameId = window.requestAnimationFrame(step);
          } else {
            if (ref.current) ref.current.textContent = end;
          }
        };
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        // Reset when scrolled out of view
        if (ref.current) ref.current.textContent = "0";
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, suffix]);

  return (
    <span className="inline-flex items-baseline">
      <span ref={ref}>0</span>
      {suffix && (
        <span className="tracking-[0.1em] ml-1">{suffix}</span>
      )}
    </span>
  );
};

export default CountUp;
