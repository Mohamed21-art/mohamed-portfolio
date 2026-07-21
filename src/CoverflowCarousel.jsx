import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    icon: <svg width="56" height="56" viewBox="0 0 1080 1080" fill="none" stroke="currentColor" strokeWidth="75" strokeLinecap="round" strokeLinejoin="round"><path d="M588.7,995.11c-5.02,26.9-30.9,44.63-57.8,39.61-20.11-3.76-35.85-19.49-39.61-39.61-35.02-208.23-198.17-371.39-406.41-406.41-26.9-5.02-44.63-30.9-39.61-57.8,3.76-20.11,19.49-35.85,39.61-39.61,208.23-35.02,371.39-198.17,406.41-406.41,5.02-26.9,30.9-44.63,57.8-39.61,20.11,3.76,35.85,19.49,39.61,39.61,35.02,208.23,198.18,371.39,406.41,406.41,26.9,5.02,44.63,30.9,39.61,57.8-3.76,20.11-19.49,35.85-39.61,39.61-208.23,35.02-371.39,198.17-406.41,406.41"/></svg>
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
    theme: "light",
    icon: <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  }
];

export default function CoverflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Auto-play interval (every 2 seconds)
  useEffect(() => {
    if (isHovered) return; // Pause on hover
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % capabilities.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      setActiveIndex((prev) => Math.min(prev + 1, capabilities.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeIndex < capabilities.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const easeSpring = [0.22, 0.61, 0.36, 1]; // custom cubic-bezier ease

  return (
    <div 
      className="relative w-full py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center"
      style={{ perspective: '1200px' }}
      ref={containerRef}
    >
      <div 
        className="relative flex items-center justify-center w-full h-[450px] md:h-[550px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence initial={false}>
          {capabilities.map((cap, index) => {
            // Determine relative position
            const diff = index - activeIndex;
            const isCenter = diff === 0;
            const isLeft = diff < 0;
            // Only render cards close to center for performance
            if (Math.abs(diff) > 2) return null;

            // Compute transforms
            // Mobile: narrower gaps, less extreme rotation
            let xPos = diff * (isMobile ? 280 : 350); 
            // Add a bit more spacing on desktop to clear the wide cards
            if (!isMobile) xPos = diff * 420;

            const zPos = isCenter ? 0 : -200;
            const rotateY = isCenter ? 0 : (isLeft ? 35 : -35);
            const scale = isCenter ? 1 : 0.82;
            const opacity = isCenter ? 1 : (Math.abs(diff) === 1 ? 0.6 : 0);
            const blur = isCenter ? 0 : 3;
            
            const isDark = cap.theme === 'dark';

            return (
              <motion.div
                key={index}
                className="absolute top-0 flex flex-col justify-between rounded-[32px] overflow-hidden p-8 md:p-10 cursor-pointer shadow-2xl"
                style={{
                  width: isMobile ? '85vw' : '480px',
                  height: '100%',
                  transformOrigin: 'center center',
                  zIndex: isCenter ? 10 : 5 - Math.abs(diff),
                  backgroundColor: isDark ? '#0E0E10' : '#F4F2EE',
                  color: isDark ? '#EDEDED' : '#1A1A1A',
                  border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #D97757',
                  boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)' : undefined,
                  // Subtle dot grid overlay via pseudo element or inline style
                  backgroundImage: `radial-gradient(rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.06) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
                initial={false}
                animate={{
                  x: xPos,
                  z: zPos,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  duration: 0.6,
                  ease: easeSpring
                }}
                whileHover={!isCenter && !isMobile ? { 
                  scale: 0.85, 
                  y: -10, 
                  rotateY: isLeft ? 30 : -30,
                  opacity: 0.8
                } : undefined}
                onClick={() => setActiveIndex(index)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => {
                  setTimeout(() => setIsHovered(false), 2000);
                }}
              >
                {/* Radial / Mesh Blur Gradient layer */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none opacity-50 transition-opacity duration-700 mix-blend-screen"
                  style={{
                    background: isDark 
                      ? 'radial-gradient(circle at 70% 30%, rgba(217, 119, 87, 0.4), rgba(232, 148, 106, 0.2), transparent 60%)'
                      : 'radial-gradient(circle at 70% 30%, rgba(217, 119, 87, 0.2), rgba(242, 180, 140, 0.1), transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                />

                {/* Scrim for legibility */}
                {isDark && (
                  <div className="absolute inset-0 z-0 bg-black/10 pointer-events-none"></div>
                )}

                {/* Giant Watermark Number */}
                <div className={`absolute top-8 right-6 text-[180px] font-serif font-bold leading-none pointer-events-none z-0 ${isDark ? 'text-white' : 'text-black'} opacity-5`}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">

                  {/* Middle Text */}
                  <div className="mt-auto mb-8">
                    {/* Large Icon */}
                    <div className={`mb-6 transition-colors duration-500 ${isCenter ? 'text-accent' : (isDark ? 'text-white/40' : 'text-black/30')}`}>
                      {cap.icon}
                    </div>

                    <h3 className={`text-3xl md:text-5xl font-serif font-bold leading-[1.1] mb-5 tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {cap.title}
                    </h3>
                    <p className={`text-sm md:text-base leading-relaxed max-w-[85%] ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      {cap.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-3 mt-12 md:mt-16 z-20">
        {capabilities.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === i 
                ? 'w-8 h-2 bg-accent' 
                : 'w-2 h-2 bg-border hover:bg-muted'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
