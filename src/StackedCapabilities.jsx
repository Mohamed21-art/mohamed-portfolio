import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const capabilities = [
  {
    title: "Brand Identity Systems",
    desc: "Crafting cohesive visual languages that define modern luxury and technical precision.",
    theme: "dark",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  },
  {
    title: "AI Content Production",
    desc: "Leveraging generative models to scale high-end visual output without compromising quality.",
    theme: "light",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  },
  {
    title: "Video Editing & Motion",
    desc: "Dynamic pacing, cinematic cuts, and kinetic typography that drives narrative momentum.",
    theme: "dark",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
  },
  {
    title: "Educational Content",
    desc: "AI-powered educational videos and presentations for schools, universities, and educators — content that makes complex ideas clear for students and teachers.",
    theme: "light",
    icon: <GraduationCap size={56} strokeWidth={1} />
  },
  {
    title: "Creative Direction",
    desc: "Guiding the holistic visual strategy from initial moodboard to final delivery.",
    theme: "dark",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  },
  {
    title: "Product Visuals",
    desc: "Hyper-realistic renders and macro videography that elevate product perception.",
    theme: "dark",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  }
];

// Inner component for each card to handle its own scaling based on scroll
const StackedCard = ({ cap, index, total, containerRef }) => {
  const isDark = cap.theme === 'dark';
  
  // Create a scroll progress tied to the overall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate when this specific card becomes active and when the NEXT card covers it
  // We want it to scale down slightly when the next card is scrolling over it.
  // This is a subtle effect for depth.
  const startScale = (index + 0.5) / total; 
  const endScale = (index + 1.5) / total;
  
  const scale = useTransform(scrollYProgress, [startScale, endScale], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [startScale, endScale], [1, 0.7]);

  // Handle prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  
  // Base offset from top for the sticky positioning
  // We start at 12vh and add 3.5rem (approx 56px) for each subsequent card so the header peeks out.
  const topOffset = `calc(12vh + ${index * 3.5}rem)`;
  
  return (
    <motion.div
      style={{
        position: 'sticky',
        top: topOffset,
        marginBottom: index === total - 1 ? '10vh' : '50vh', // Space between cards to allow scrolling
        scale: prefersReducedMotion ? 1 : scale,
        opacity: prefersReducedMotion ? 1 : opacity,
        transformOrigin: "top center",
      }}
      className="w-full max-w-5xl mx-auto px-4 md:px-6"
    >
      <div 
        className={`w-full min-h-[40vh] md:min-h-[50vh] rounded-[32px] overflow-hidden p-8 md:p-12 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-8 md:gap-12 relative ${
          isDark 
            ? 'bg-[#0E0E10] text-[#EDEDED] border-t border-white/10' 
            : 'bg-[#F4F2EE] text-[#1A1A1A] border-t border-black/5'
        }`}
        style={{
          // Subtle dot grid overlay via inline style
          backgroundImage: `radial-gradient(rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.06) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        {/* Giant Watermark Number */}
        <div className={`absolute top-4 right-8 md:right-12 text-[120px] md:text-[200px] font-serif font-bold leading-none pointer-events-none z-0 ${isDark ? 'text-white' : 'text-black'} opacity-5`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Left Side: Icon & Meta */}
        <div className="flex flex-col justify-between shrink-0 relative z-10 md:w-1/3">
          <div className="flex flex-col gap-2 mb-8 md:mb-0">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-white/60' : 'text-black/50'}`}>
              03 — Capabilities
            </span>
            <span className={`text-[10px] font-bold tracking-widest ${isDark ? 'text-accent' : 'text-accent-ink'}`}>
              {String(index + 1).padStart(2, '0')}/06
            </span>
          </div>
          
          {/* Large Icon */}
          <div className={`mb-2 md:mb-6 mt-4 md:mt-12 transition-colors duration-500 text-accent`}>
            {cap.icon}
          </div>
        </div>

        {/* Right Side: Title & Description */}
        <div className="flex flex-col justify-end relative z-10 md:w-2/3 md:pb-6">
          <h3 className={`text-3xl md:text-5xl font-serif font-bold leading-[1.1] mb-5 tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            {cap.title}
          </h3>
          <p className={`text-base md:text-lg leading-relaxed max-w-xl ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            {cap.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function StackedCapabilities() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="relative w-full pb-[10vh]">
      {capabilities.map((cap, index) => (
        <StackedCard 
          key={index} 
          cap={cap} 
          index={index} 
          total={capabilities.length} 
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
