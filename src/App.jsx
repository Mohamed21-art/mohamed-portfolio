import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './index.css';
import TimelineBackground from './TimelineBackground';
import CountUp from './CountUp';
import CoverflowCarousel from './CoverflowCarousel';
import CustomCursor from './CustomCursor';
import heroBg from './assets/d59f90ac-4ec9-49ef-a568-b4420caa1e3f.jpeg';

const ScrollRevealItem = ({ children, index, className, dataCursor }) => {
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  if (prefersReducedMotion) {
    return <div className={className} data-cursor={dataCursor}>{children}</div>;
  }

  // Adjust delay on desktop for a staggered effect, but keep it snappy
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3), ease: "easeOut" }}
      className={className}
      data-cursor={dataCursor}
    >
      {children}
    </motion.div>
  );
};

const Typewriter = ({ segments }) => {
  const [charIndex, setCharIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef(null);

  const totalChars = segments.reduce((acc, seg) => acc + seg.text.length, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
        } else {
          setIsStarted(false);
          setCharIndex(0);
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isStarted && charIndex < totalChars) {
      const timer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 15); // Typing speed
      return () => clearTimeout(timer);
    }
  }, [isStarted, charIndex, totalChars]);

  let charsRendered = 0;

  return (
    <span ref={containerRef} className="relative">
      {segments.map((seg, i) => {
        const segLen = seg.text.length;
        const startIdx = charsRendered;
        charsRendered += segLen;

        if (charIndex <= startIdx) return null; // Not reached yet

        // Partially or fully render this segment
        const visibleLen = Math.min(charIndex - startIdx, segLen);
        const visibleText = seg.text.substring(0, visibleLen);

        return (
          <span key={i} className={seg.highlight ? "bg-accent text-[#EFECE5] px-1.5 rounded-sm font-semibold mx-1 shadow-sm" : ""}>
            {visibleText}
          </span>
        );
      })}
      {/* Blinking cursor */}
      <span className={`inline-block w-[3px] h-[1em] bg-current align-middle ml-1 ${charIndex >= totalChars ? 'animate-pulse' : ''}`}></span>
    </span>
  );
};

const WordReveal = ({ text, delayOffset = 0, highlightWordIndices = [], fillDelay }) => {
  const words = text.split(" ");
  
  // Calculate default fill delay if none provided
  const defaultFillDelay = delayOffset + (words.length - 1) * 60 + 600 + 400; 
  const finalFillDelay = fillDelay || defaultFillDelay;

  return (
    <span className="inline-flex flex-wrap gap-x-[0.25em]">
      {words.map((word, i) => {
        const isHighlight = highlightWordIndices.includes(i);
        
        return (
          <span
            key={i}
            className={`reveal inline-block ${isHighlight ? 'fill-up-text font-bold' : ''}`}
            style={{ 
              transitionDelay: `${delayOffset + i * 60}ms`,
              ...(isHighlight ? { animationDelay: `${finalFillDelay}ms` } : {})
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

const ThemeToggle = ({ isDarkMode, onToggle, id = "moon-mask" }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      role="button"
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-accent hover:shadow-[0_0_10px_rgba(217,119,87,0.3)] focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: isDarkMode ? 'rotate(40deg)' : 'rotate(0deg)', transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)' }}
        className="text-text"
      >
        <mask id={id}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle
            cx={isDarkMode ? "12" : "30"}
            cy={isDarkMode ? "4" : "12"}
            r="9"
            fill="black"
            style={{ transition: 'cx 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), cy 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)' }}
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          fill={isDarkMode ? "currentColor" : "none"}
          r={isDarkMode ? "9" : "5"}
          mask={`url(#${id})`}
          style={{ transition: 'r 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), fill 0.5s ease' }}
        />
        <g style={{ opacity: isDarkMode ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  );
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const insightsRef = useRef(null);
  const { scrollYProgress: insightsProgress } = useScroll({
    target: insightsRef,
    offset: ["start 90%", "end 80%"]
  });

  const workRef = useRef(null);
  const { scrollYProgress: workProgress } = useScroll({
    target: workRef,
    offset: ["start 90%", "end 80%"]
  });

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const observerRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Custom Cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, textarea, select, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Scroll handler for Nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Hysteresis: animate IN when at least 15% visible, animate OUT only when completely invisible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          entry.target.classList.add('in-view');
        } else if (!entry.isIntersecting) {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: [0, 0.15], rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
    }, 1000);
  };

  const aboutSegments = [
    { text: "My philosophy is simple: combine " },
    { text: "human taste", highlight: true },
    { text: " with " },
    { text: "machine efficiency.", highlight: true },
    { text: " I don't just edit videos—I build " },
    { text: "scalable visual systems", highlight: true },
    { text: " that help brands dominate their niche." }
  ];

  const projects = [
    {
      id: 1,
      clientName: "ELEVATE APP",
      title: "Launch Campaign",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
    },
    {
      id: 2,
      clientName: "NEXUS STUDIOS",
      title: "Brand Anthem",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 3,
      clientName: "AURA BEAUTY",
      title: "Summer Collection",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 4,
      clientName: "TECHNOCORE",
      title: "Product Teaser",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800&h=1000"
    }
  ];

  return (
    <div className="min-h-screen text-text bg-bg antialiased selection:bg-accent/20 relative transition-colors duration-300">
      <CustomCursor />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <TimelineBackground isDarkMode={isDarkMode} />

      {/* 1. NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-custom mx-auto px-6 lg:px-8 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
            Mohamed<span className="text-accent">.</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-8">
              <button onClick={() => scrollTo('work')} className="hover:text-accent transition-colors">Work</button>
              <button onClick={() => scrollTo('about')} className="hover:text-accent transition-colors">About</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-accent transition-colors">Contact</button>
            </div>
            <div className="w-px h-4 bg-border/60 mx-2"></div>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} id="desktop-theme" />
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden text-sm font-medium hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border py-4 px-6 flex flex-col gap-4 shadow-sm">
            <button onClick={() => scrollTo('work')} className="text-left py-2 text-lg hover:text-accent transition-colors">Work</button>
            <button onClick={() => scrollTo('about')} className="text-left py-2 text-lg hover:text-accent transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="text-left py-2 text-lg hover:text-accent transition-colors">Contact</button>
            <div className="flex items-center justify-between py-2 mt-2 border-t border-border">
              <span className="text-lg">Theme</span>
              <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} id="mobile-theme" />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Background Cover */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden">
        <img
          src={heroBg}
          alt="Hero Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40 blur-[3px]"
        />
        {/* Horizontal gradient (stronger on mobile, fading right on desktop) */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 md:via-bg/85 to-bg/70 md:to-bg/40"></div>
        {/* Vertical gradient to fade into background at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent"></div>
        {/* Subtle terracotta glow for atmosphere */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <main className="max-w-custom mx-auto px-6 lg:px-8 pt-32 md:pt-48 relative overflow-hidden md:overflow-visible">

        {/* 2. HERO */}
        <section className="min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center section-padding pt-0 relative z-10">
          <div className="flex items-center gap-2 mb-6 reveal">
            <div className="w-2.5 h-2.5 rounded-full bg-accent rec-pulse shadow-[0_0_8px_rgba(217,119,87,0.8)]"></div>
            <span className="mono-label !mb-0 tracking-[0.1em] text-[11px] font-bold">REC</span>
            <span className="mono-label !mb-0 ml-4 hidden sm:inline">— Available for freelance</span>
          </div>
          <h1 className="text-step-hero leading-tight tracking-tight mb-8 max-w-6xl relative z-10 flex flex-col" data-cursor="text">
            <div>
              <WordReveal text="Blending AI innovation with" delayOffset={0} />
            </div>
            <div>
              <WordReveal text="raw talent & experience" delayOffset={250} highlightWordIndices={[0, 1]} fillDelay={1100} />
            </div>
            <div>
              <WordReveal text="for high-end visual results." delayOffset={500} />
            </div>
          </h1>
          <p className="text-muted text-step-body reveal mb-6 md:mb-10 max-w-3xl" style={{ transitionDelay: '750ms' }}>
            Video Editor & Visual Designer based in the UAE.<br />
            Delivering cinematic quality by merging human creativity with cutting-edge artificial intelligence tools.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mt-0">
            <button
              onClick={() => scrollTo('contact')}
              className="reveal bounce btn-primary pulse-accent"
              style={{ transitionDelay: '900ms' }}
            >
              <span className="relative z-10 pointer-events-none">Let's Talk</span>
            </button>
            <button
              onClick={() => scrollTo('work')}
              className="reveal bounce px-8 py-3.5 rounded-xl bg-accent text-[#EFECE5] font-medium btn-solid-glow"
              style={{ transitionDelay: '1050ms' }}
            >
              View Selected Work →
            </button>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="pt-4 md:pt-8 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Header matches the screenshot structure */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-text max-w-2xl leading-tight" data-cursor="text">
                Scaling impact through visual precision
              </h2>
              <p className="text-muted text-sm max-w-xs leading-relaxed md:pb-2">
                Maximizing reach by combining human creativity with high-end AI-driven workflows.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Cell 1: Light */}
              <div className="bg-accent text-white rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl p-5 md:p-7 flex flex-row items-center md:items-start md:flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 relative group overflow-hidden reveal">
                {/* Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/20 text-white flex items-center justify-center mr-4 md:mr-0 md:mb-4 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                </div>

                {/* Text Group */}
                <div className="flex flex-col">
                  {/* Number */}
                  <h3 className="text-4xl md:text-6xl font-mono font-bold text-white mb-0.5 md:mb-1 tracking-tighter leading-none">
                    <CountUp end={10} duration={2000} suffix="M+" />
                  </h3>

                  {/* Title */}
                  <p className="font-semibold text-white/90 text-sm md:text-lg leading-tight">Gulf Views</p>

                  {/* Desc */}
                  <p className="mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-white/95 text-left uppercase tracking-wider font-medium">
                    Generated across audiences
                  </p>
                </div>
              </div>

              {/* Cell 2: Light */}
              <div className="bg-surface border border-border/60 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl p-5 md:p-7 flex flex-row items-center md:items-start md:flex-col hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative group overflow-hidden reveal">
                {/* Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center mr-4 md:mr-0 md:mb-4 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>

                {/* Text Group */}
                <div className="flex flex-col">
                  {/* Number */}
                  <h3 className="text-4xl md:text-6xl font-mono font-bold text-accent mb-0.5 md:mb-1 tracking-tighter leading-none">
                    <CountUp end={4} duration={1500} suffix="+" />
                  </h3>

                  {/* Title */}
                  <p className="font-semibold text-text text-sm md:text-lg leading-tight">Years Exp.</p>

                  {/* Desc */}
                  <p className="mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-muted text-left uppercase tracking-wider font-medium">
                    In production & editing
                  </p>
                </div>
              </div>

              {/* Cell 3: Accent */}
              <div className="bg-surface border border-border/60 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl p-5 md:p-7 flex flex-row items-center md:items-start md:flex-col hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative group overflow-hidden reveal">
                {/* Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center mr-4 md:mr-0 md:mb-4 group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>

                {/* Text Group */}
                <div className="flex flex-col">
                  {/* Number */}
                  <h3 className="text-4xl md:text-6xl font-mono font-bold text-accent mb-0.5 md:mb-1 tracking-tighter leading-none">
                    AI
                  </h3>

                  {/* Title */}
                  <p className="font-semibold text-text text-sm md:text-lg leading-tight">Native Pipeline</p>

                  {/* Desc */}
                  <p className="mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-muted text-left uppercase tracking-wider font-medium">
                    End-to-end implementation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-12 md:py-16 reveal stagger-3 flex items-center justify-center -mx-6 lg:-mx-8 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content">
              {/* First Half */}
              <span className="text-white">Video Editing</span>
              <span className="text-accent">Motion Design</span>
              <span className="text-white">Color Grading</span>
              <span className="text-accent">Creative Direction</span>
              <span className="text-white">Visual Storytelling</span>
              <span className="text-accent">Post Production</span>
              {/* Second Half (Duplicate for seamless loop) */}
              <span className="text-white">Video Editing</span>
              <span className="text-accent">Motion Design</span>
              <span className="text-white">Color Grading</span>
              <span className="text-accent">Creative Direction</span>
              <span className="text-white">Visual Storytelling</span>
              <span className="text-accent">Post Production</span>
            </div>
          </div>
        </section>

        {/* 3. SELECTED WORK */}
        <section id="work" className="section-padding">
          <p className="mono-label reveal mb-12">01 — Selected Work</p>
          <div ref={workRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <ScrollRevealItem
                key={project.id}
                progress={workProgress}
                index={index}
                count={projects.length}
                className="flex flex-col gap-2 group cursor-pointer"
                dataCursor="play"
              >
                <div className="rounded-[32px] border border-border bg-surface overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/5 group-hover:border-border/80">
                  {/* Header */}
                  <div className="p-3 flex items-center gap-2 border-b border-border">
                    <div className="w-7 h-7 rounded-full bg-border overflow-hidden"></div>
                    <span className="font-semibold text-xs">{project.clientName}</span>
                  </div>
                  {/* Image */}
                  <div className="aspect-[4/5] relative w-full bg-border overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  {/* Info Band */}
                  <div className="p-4 border-t border-border">
                    <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                    <p className="text-muted text-xs leading-relaxed">{project.type}</p>
                  </div>
                  {/* Actions */}
                  <div className="p-3 border-t border-border flex justify-between items-center text-text">
                    <div className="flex items-center gap-3">
                      {/* Heart */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      {/* Comment */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                      {/* Share */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </div>
                    <div>
                      {/* Bookmark */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted font-medium ml-1">Instagram post [0{project.id}]</p>
              </ScrollRevealItem>
            ))}
          </div>
        </section>

        {/* 4. CAPABILITIES */}
        <section className="reveal pt-12 md:pt-24 pb-0">
          <p className="mono-label mb-8 px-6 lg:px-8 max-w-custom mx-auto">02 — Capabilities</p>
          <div className="-mx-6 lg:-mx-8">
            <CoverflowCarousel />
          </div>
        </section>

        {/* 5. ABOUT */}
        <section id="about" className="section-padding relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="reveal mb-8">
              <p className="mono-label">03 — My Philosophy</p>
            </div>
            <div className="reveal stagger-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed md:leading-relaxed text-text max-w-5xl">
                <Typewriter segments={aboutSegments} />
              </h2>
            </div>
          </div>
        </section>

        {/* 6. CONTACT */}
        <section id="contact" className="section-padding relative">
          <p className="mono-label reveal mb-12">04 — Let's Work</p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5 lg:col-span-6 reveal">
              <h2 className="text-step-hero leading-none mb-6">Have a project in mind?</h2>
              <p className="text-muted text-lg mb-12 max-w-md">
                I'm currently taking on new projects for Q3. Drop me a message and let's discuss how we can bring your vision to life.
              </p>

              <div className="flex flex-col gap-4">
                <a href="mailto:Muhmdsayed21@gmail.com" className="text-lg font-medium hover:text-accent transition-colors w-fit">
                  Muhmdsayed21@gmail.com
                </a>
                <div className="flex flex-wrap gap-6 mt-2 text-muted">
                  <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors group cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors group cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><line x1="8" y1="20" x2="12" y2="11" /><path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" /><circle cx="12" cy="12" r="9" /></svg>
                    <span>Pinterest</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors group cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" fill="currentColor" /></svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-6 reveal stagger-1">
              {formStatus === 'success' ? (
                <div className="bg-surface border border-border rounded-custom p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Message Sent</h3>
                  <p className="text-muted">Thanks for reaching out. I'll get back to you shortly.</p>
                  <button
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 text-sm font-medium text-accent hover:text-accent-ink underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="input-label">Name</label>
                    <input type="text" id="name" required className="input-field" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="input-label">Email</label>
                    <input type="email" id="email" required className="input-field" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label htmlFor="type" className="input-label">Project Type</label>
                    <div className="relative">
                      <select id="type" required className="input-field appearance-none bg-white">
                        <option value="" disabled selected>Select an option</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Branding">Branding</option>
                        <option value="Full Production">Full Production</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="input-label">Message</label>
                    <textarea id="message" required rows="4" className="input-field resize-y" placeholder="Tell me about your project..."></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full md:w-auto btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                  >
                    <span className="relative z-10 pointer-events-none">
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-custom mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© {new Date().getFullYear()} Mohamed. All rights reserved.</p>
          <p>Designed and built with intention.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
