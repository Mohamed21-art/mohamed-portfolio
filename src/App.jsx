import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import './index.css';
import TimelineBackground from './TimelineBackground';
import CountUp from './CountUp';
import CoverflowCarousel from './CoverflowCarousel';
import CustomCursor from './CustomCursor';
import heroPoster from './assets/hero-bg.jpg';
import knozLogo from './assets/logo-00.png';
import logoKnoz from './assets/logo-knoz-copy.webp';
import clockThumbnail from './assets/Clock-thumbnail.webp';
import sanwakThumbnail from './assets/Sanwak-thumbnail-fixed.jpg';
import ihramThumbnail from './assets/Ihram-thumbnail.webp';
import quranSpeakerThumbnail from './assets/Magnetic Quran Speaker.webp';
import quranMagnetsLogo from './assets/quran-magnets-logo.png';
import weislamicLogo from './assets/Weislamic.webp';
import tasbeehThumbnail from './assets/ring-0.webp';
import profile01 from './assets/Profile-01.webp';
import profile02 from './assets/Profile-02.webp';
import profile03 from './assets/Profile-03.webp';
import einThumbnail from './assets/ein.webp';
import bahthDark from './assets/Bahth-dark.webp';
import bahthLight from './assets/Bahth-ligh.webp';
import brDark from './assets/BR-Dark.webp';
import brLight from './assets/BR-ligh.webp';

const ScrollRevealItem = ({ children, index, className, dataCursor, onClick }) => {
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  if (prefersReducedMotion) {
    return <div className={className} data-cursor={dataCursor} onClick={onClick}>{children}</div>;
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
      onClick={onClick}
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

const ThemeToggle = ({ themeMode, onCycle, id = "theme-toggle" }) => {
  // Icons: sun (light), moon (dark), monitor (system)
  return (
    <button
      onClick={onCycle}
      aria-label={`Theme: ${themeMode}. Click to switch.`}
      role="button"
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-accent hover:shadow-[0_0_10px_rgba(217,119,87,0.3)] focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      {/* Light mode icon (sun) */}
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-text absolute transition-all duration-300"
        style={{ opacity: themeMode === 'light' ? 1 : 0, transform: themeMode === 'light' ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)' }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      {/* Dark mode icon (moon) */}
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-text absolute transition-all duration-300"
        style={{ opacity: themeMode === 'dark' ? 1 : 0, transform: themeMode === 'dark' ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(90deg)' }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* System mode icon (monitor) */}
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-text absolute transition-all duration-300"
        style={{ opacity: themeMode === 'system' ? 1 : 0, transform: themeMode === 'system' ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(90deg)' }}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>
  );
};

const placeholderLogos = [
  <div key="bahth" className="flex items-center justify-center">
    {/* In Light Mode, use the light-themed logo */}
    <img src={bahthLight} alt="Bahth" className="block dark:hidden h-14 md:h-16 w-auto object-contain transition-all duration-300" />
    {/* In Dark Mode, use the dark-themed logo */}
    <img src={bahthDark} alt="Bahth" className="hidden dark:block h-14 md:h-16 w-auto object-contain transition-all duration-300" />
  </div>,
  <div key="br" className="flex items-center justify-center">
    {/* In Light Mode, use the light-themed logo */}
    <img src={brLight} alt="BR" className="block dark:hidden h-14 md:h-16 w-auto object-contain transition-all duration-300" />
    {/* In Dark Mode, use the dark-themed logo */}
    <img src={brDark} alt="BR" className="hidden dark:block h-14 md:h-16 w-auto object-contain transition-all duration-300" />
  </div>,
  <svg key="link" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  <svg key="star" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="wave" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  <svg key="layout" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  <svg key="shield" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="layers" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
];

const TrustedMarquee = () => {
  return (
    <section className="py-10 md:py-12 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Static Label */}
        <p className="mono-label !mb-0 whitespace-nowrap text-muted shrink-0 text-sm tracking-widest text-center md:text-left flex items-center h-16">TRUSTED BY</p>
        
        {/* Marquee Container */}
        <div 
          className="relative w-full overflow-hidden flex items-center pause-on-hover" 
          style={{ maskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)' }}
        >
          {/* We duplicate the content to create an infinite loop */}
          <div className="flex items-center w-max motion-safe:animate-marquee-slow">
            {[...placeholderLogos, ...placeholderLogos].map((logo, index) => (
              <div 
                key={index} 
                className="mx-8 md:mx-16 text-muted opacity-60 hover:text-accent hover:opacity-100 transition-all duration-300 transform hover:scale-110 flex-shrink-0 cursor-default flex items-center justify-center h-16"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [formErrors, setFormErrors] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showFloatingContact, setShowFloatingContact] = useState(false);
  const heroRef = useRef(null);
  const contactRef = useRef(null);

  const workRef = useRef(null);
  const { scrollYProgress: workProgress } = useScroll({
    target: workRef,
    offset: ["start 90%", "end 80%"]
  });

  // Theme state: 'light' | 'dark' | 'system'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const cycleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const observerRef = useRef(null);

  useEffect(() => {
    const applyTheme = () => {
      const shouldBeDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', themeMode);

    // Listen for OS theme changes when in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

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

    // Floating Contact Observer
    let heroVisible = true;
    let contactVisible = false;

    const floatingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === heroRef.current) heroVisible = entry.isIntersecting;
        if (entry.target === contactRef.current) contactVisible = entry.isIntersecting;
      });
      setShowFloatingContact(!heroVisible && !contactVisible);
    }, { threshold: 0 });

    if (heroRef.current) floatingObserver.observe(heroRef.current);
    if (contactRef.current) floatingObserver.observe(contactRef.current);

    return () => {
      observerRef.current?.disconnect();
      floatingObserver.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const projectType = form.type.value;
    const message = form.message.value.trim();

    let errors = {};
    if (!name) errors.name = "Name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormStatus('submitting');

    try {
      const response = await fetch("https://formspree.io/f/mjgnbkbw", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, projectType, message })
      });

      if (!response.ok) {
        throw new Error('Failed');
      }
      setFormStatus('success');
      form.reset();
    } catch (error) {
      setFormStatus('error');
    }
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
      clientName: "Knoz store",
      avatar: logoKnoz,
      title: "Ihram Capsule Garment — Product Ad",
      type: "Ihram — Capsule-Fastening Garment for Hajj & Umrah\nA product ad, crafted end to end.",
      thumbnail: ihramThumbnail,
      link: "https://player.vimeo.com/video/1211631629?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 2,
      clientName: "Sanowak",
      avatar: knozLogo,
      title: "SANOWAK — Short-Form Product Ad",
      type: "SANOWAK — Natural Siwak Toothbrush\nA 20-second product ad, crafted end to end.",
      thumbnail: sanwakThumbnail,
      link: "https://player.vimeo.com/video/1211359609?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 3,
      clientName: "Knoz store",
      avatar: logoKnoz,
      title: "Smart Athan Clock — Product Ad",
      type: "Smart Athan Clock\nA product ad, crafted end to end.",
      thumbnail: clockThumbnail,
      link: "https://player.vimeo.com/video/1211622815?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 4,
      clientName: "quranmagnets",
      avatar: quranMagnetsLogo,
      title: "Magnetic Quran Speaker",
      type: "I handled the full production:\nlighting, indoor & outdoor shooting, edit,\nand professional AI-generated sound design.",
      thumbnail: quranSpeakerThumbnail,
      link: "https://player.vimeo.com/video/1211658771?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 5,
      clientName: "Weslamic",
      avatar: weislamicLogo,
      title: "Smart Tasbih Ring",
      type: "Smart Tasbih Ring — Digital Dhikr Counter\nAn unboxing product film, crafted end to end.",
      thumbnail: tasbeehThumbnail,
      link: "https://player.vimeo.com/video/1211664190?badge=0&autopause=0&player_id=0&app_id=58479"
    }
  ];

  const educationalProjects = [
    {
      id: 1,
      title: "Arabic Letters for Kids — Learning \"Ein\"",
      category: "Story-Based Learning",
      thumbnail: einThumbnail,
      link: "https://player.vimeo.com/video/1212043007?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 2,
      title: "The Future of AI in Design",
      category: "School Presentation",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=75&w=800&fm=webp&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Prompt Engineering 101",
      category: "Course Explainer",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=75&w=800&fm=webp&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Interactive Storytelling Workshop",
      category: "Student Workshop",
      thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=75&w=800&fm=webp&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Advanced Data Visualization",
      category: "University Lecture",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=75&w=800&fm=webp&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Creative Coding for Beginners",
      category: "Course Explainer",
      thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=75&w=800&fm=webp&auto=format&fit=crop"
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
              <button onClick={() => scrollTo('education')} className="hover:text-accent transition-colors">Education</button>
              <button onClick={() => scrollTo('about')} className="hover:text-accent transition-colors">About</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-accent transition-colors">Contact</button>
            </div>
            <div className="w-px h-4 bg-border/60 mx-2"></div>
            <ThemeToggle themeMode={themeMode} onCycle={cycleTheme} id="desktop-theme" />
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
            <button onClick={() => scrollTo('education')} className="text-left py-2 text-lg hover:text-accent transition-colors">Education</button>
            <button onClick={() => scrollTo('about')} className="text-left py-2 text-lg hover:text-accent transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="text-left py-2 text-lg hover:text-accent transition-colors">Contact</button>
            <div className="flex items-center justify-between py-2 mt-2 border-t border-border">
              <span className="text-lg">Theme</span>
              <ThemeToggle themeMode={themeMode} onCycle={cycleTheme} id="mobile-theme" />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Background Cover */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden">
        <video
          poster={heroPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40 blur-[3px]"
        >
          <source src="/website-banner.webm" type="video/webm" />
        </video>
        {/* Horizontal gradient (stronger on mobile, fading right on desktop) */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 md:via-bg/85 to-bg/70 md:to-bg/40"></div>
        {/* Vertical gradient to fade into background at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent"></div>
        {/* Subtle terracotta glow for atmosphere */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <main className="max-w-custom mx-auto px-6 lg:px-8 pt-32 md:pt-48 relative overflow-hidden md:overflow-visible">

        {/* 2. HERO */}
        <section ref={heroRef} className="min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center section-padding pt-0 relative z-10">
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
              style={{ transitionDelay: '950ms' }}
            >
              View Selected Work →
            </button>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="pt-4 md:pt-8 pb-8 md:pb-12">
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
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/20 text-white flex items-center justify-center mr-4 md:mr-0 md:mb-4 group-hover:scale-110 transition-transform relative z-10">
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
          <div className="flex items-center gap-6 mb-12 reveal w-full">
            <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-accent">01</span> <span className="opacity-50 font-normal">—</span> SELECTED WORK
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          <div ref={workRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <ScrollRevealItem
                key={project.id}
                progress={workProgress}
                index={index}
                count={projects.length}
                className="flex flex-col gap-2 group cursor-pointer h-full"
                dataCursor="play"
              >
                <div
                  onClick={() => project.link ? setActiveVideo({ url: project.link, isPortrait: true }) : null}
                  className="rounded-[32px] border border-border bg-surface overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/5 group-hover:border-border/80 flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="p-3 flex items-center gap-2 border-b border-border">
                    <div className="w-7 h-7 rounded-full bg-border overflow-hidden">
                      {project.avatar ? (
                        <img src={project.avatar} alt={project.clientName} loading="lazy" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
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
                  <div className="p-4 border-t border-border flex-grow">
                    <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                    <p className="text-muted text-xs leading-relaxed whitespace-pre-wrap">{project.type}</p>
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
        {/* 2. EDUCATIONAL CONTENT */}
        <section id="education" className="section-padding pt-8 md:pt-16">
          <div className="flex items-center gap-6 mb-8 reveal w-full">
            <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-accent">02</span> <span className="opacity-50 font-normal">—</span> EDUCATIONAL CONTENT
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          <p className="text-muted text-base max-w-2xl reveal mb-12">
            AI-powered educational videos and presentations for schools, universities, and educators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalProjects.map((project, index) => (
              <ScrollRevealItem
                key={project.id}
                index={index}
                className="flex flex-col gap-3 group cursor-pointer"
                dataCursor="play"
                onClick={() => project.link ? setActiveVideo({ url: project.link, isPortrait: false }) : null}
              >
                <div className="aspect-video relative w-full rounded-[24px] border border-border bg-surface overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/5 group-hover:border-border/80">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="px-1 flex flex-col gap-1">
                  <h4 className="font-semibold text-lg">{project.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-muted text-sm">
                    <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-xs font-medium">{project.category}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-accent hover:underline">Click here to watch</span>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </div>
        </section>

        <TrustedMarquee />

        {/* 3. CAPABILITIES */}
        <section className="reveal pt-8 md:pt-16 pb-0">
          <div className="flex items-center gap-6 mb-8 px-6 lg:px-8 max-w-custom mx-auto w-full">
            <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-accent">03</span> <span className="opacity-50 font-normal">—</span> CAPABILITIES
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          <div className="-mx-6 lg:-mx-8">
            <CoverflowCarousel />
          </div>
        </section>

        {/* 5. ABOUT */}
        <section id="about" className="section-padding relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="reveal mb-8 flex items-center gap-6 w-full">
              <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
                <span className="text-accent">04</span> <span className="opacity-50 font-normal">—</span> MY PHILOSOPHY
              </h2>
              <div className="h-px bg-border flex-grow"></div>
            </div>
            <div className="reveal stagger-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed md:leading-relaxed text-text max-w-5xl">
                <Typewriter segments={aboutSegments} />
              </h2>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section-padding">
          <div className="flex items-center gap-6 mb-12 reveal w-full">
            <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-accent">05</span> <span className="opacity-50 font-normal">—</span> CLIENT FEEDBACK
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Mohamed has an exceptional eye for video and visual storytelling. Every deliverable was polished, considered, and exactly what we needed.",
                name: "AHMED AL MANSOURI",
                role: "Marketing Director, Knoz Store",
                avatar: profile01
              },
              {
                quote: "Working with Mohamed felt effortless. He grasped the brief immediately and delivered content that performed from the very first post.",
                name: "KHALID AL HASHIMI",
                role: "Founder, Weslamic",
                avatar: profile02
              },
              {
                quote: "The content Mohamed created became core to our brand — campaigns, product launches, educational videos. Truly exceptional work.",
                name: "OMAR AL SUWAIDI",
                role: "CEO, Quran Magnets",
                avatar: profile03
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="reveal bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Quotation mark */}
                <div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-accent opacity-20 mb-4">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.7 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.277-.566-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.7 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.277-.566-2.917-1.179z" />
                  </svg>
                  <p className="text-text text-sm md:text-base leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-5"></div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-border overflow-hidden shrink-0">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-xs tracking-wider text-text">{testimonial.name}</p>
                    <p className="text-muted text-[11px] tracking-wider uppercase">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CONTACT */}
        <section id="contact" ref={contactRef} className="section-padding relative">
          <div className="flex items-center gap-6 mb-12 reveal w-full">
            <h2 className="mono-label !mb-0 text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-accent">06</span> <span className="opacity-50 font-normal">—</span> LET'S WORK
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
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
                  <a href="https://www.linkedin.com/in/muhmd-sayed/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors group cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                    <span>LinkedIn</span>
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
                <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
                      Something went wrong — please email me directly at Muhmdsayed21@gmail.com
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="input-label">Name</label>
                    <input type="text" id="name" name="name" className={`input-field ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`} placeholder="Ahmed Al Mansouri" />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="input-label">Email</label>
                    <input type="email" id="email" name="email" className={`input-field ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''}`} placeholder="ahmed@example.com" />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="type" className="input-label">Project Type</label>
                    <div className="relative">
                      <select id="type" name="type" defaultValue="" className="input-field appearance-none bg-white dark:bg-[#0E0E10]">
                        <option value="" disabled>Select an option</option>
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
                    <textarea id="message" name="message" rows="4" className={`input-field resize-y ${formErrors.message ? 'border-red-500 focus:border-red-500' : ''}`} placeholder="Tell me about your project..."></textarea>
                    {formErrors.message && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.message}</p>}
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

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <button
            className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-[110]"
            onClick={() => setActiveVideo(null)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className={`w-full relative rounded-2xl overflow-hidden bg-black shadow-2xl ${activeVideo.isPortrait ? 'max-w-[400px]' : 'max-w-[1000px]'}`} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: activeVideo.isPortrait ? '177.78% 0 0 0' : '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                src={`${activeVideo.url}&autoplay=1`}
                className="w-full h-full absolute top-0 left-0"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Video Embed"
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Button */}
      <div 
        className={`fixed end-6 bottom-6 md:end-8 md:bottom-8 z-50 motion-safe:transition-all motion-safe:duration-300 ${showFloatingContact ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <button 
          onClick={() => scrollTo('contact')}
          className="bg-accent text-[#EFECE5] shadow-lg shadow-accent/20 hover:shadow-accent/40 rounded-full h-12 md:h-14 flex items-center justify-center gap-2 px-4 md:px-6 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Let's Talk"
        >
          <span className="hidden md:inline font-medium text-sm tracking-wide">Let's Talk</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
}

export default App;
