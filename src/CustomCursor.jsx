import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  // States
  const [cursorState, setCursorState] = useState('default'); // 'default', 'play'
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Disable custom cursor on touch devices / if pointer is not fine
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsActive(mediaQuery.matches);

    const handleTouch = () => {
      setIsActive(false);
      window.removeEventListener('touchstart', handleTouch);
    };
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    document.body.classList.add('has-custom-cursor');

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);

      // Instant follow via CSS variables with requestAnimationFrame
      if (cursorRef.current) {
        requestAnimationFrame(() => {
          cursorRef.current.style.setProperty('--x', `${e.clientX}px`);
          cursorRef.current.style.setProperty('--y', `${e.clientY}px`);
        });
      }

      // Check hovering state
      const target = e.target;
      if (target && target.closest) {
        const playTarget = target.closest('[data-cursor="play"]');

        if (playTarget) setCursorState('play');
        else setCursorState('default');

        // Update interactive buttons glow
        const btn = target.closest('.btn-primary');
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          requestAnimationFrame(() => {
            btn.style.setProperty('--mx', `${x}px`);
            btn.style.setProperty('--my', `${y}px`);
          });
        }
      }
    };

    const onMouseOver = (e) => {
      if (e.target && e.target.closest) {
        const btn = e.target.closest('.btn-primary');
        if (btn && !btn.classList.contains('is-hovered')) {
          btn.classList.add('is-hovered');
        }
      }
    };

    const onMouseOut = (e) => {
      if (e.target && e.target.closest) {
        const btn = e.target.closest('.btn-primary');
        if (btn && (!e.relatedTarget || !btn.contains(e.relatedTarget))) {
          btn.classList.remove('is-hovered');
        }
      }
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isActive, isVisible]);

  if (!isActive) return null;

  const isPlay = cursorState === 'play';

  // Wrapper handles the raw mouse position
  const wrapperStyle = {
    transform: 'translate3d(var(--x, 0px), var(--y, 0px), 0)',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.2s ease'
  };

  return (
    <div ref={cursorRef} style={wrapperStyle} className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform">
      {/* Visual layer that morphs */}
      <div
        className={`absolute flex items-center justify-center transition-all duration-200 ease-out ${isPlay
            ? 'w-[60px] h-[60px] rounded-full bg-accent text-[#EFECE5] shadow-[0_0_20px_rgba(217,119,87,0.3)] -translate-x-1/2 -translate-y-1/2'
            : 'w-[24px] h-[24px] bg-transparent text-transparent shadow-none translate-x-[-1px] translate-y-[-1px]'
          }`}
      >
        {/* The Arrow SVG */}
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          className={`absolute top-0 left-0 transition-opacity duration-200 ${isPlay ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
        >
          {/* A crisp standard arrow shape */}
          <path
            d="M1 1 L1 17 L5.5 12.5 L9.5 20 L12.5 18.5 L8.5 11 L15 11 Z"
            fill="#D97757"
            strokeLinejoin="round"
          />
        </svg>

        {/* The Play Triangle SVG */}
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
          className={`transition-all duration-200 ml-1 ${isPlay ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        >
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
      </div>
    </div>
  );
}
