import { useEffect, useState } from "react";

export default function TimelineBackground({ isDarkMode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const strokeColor = isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const clipFill = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const accentColor = "var(--accent)"; // Red/Orange playhead

  // We move the timeline tracks left as scroll increases
  // The total translation will be e.g. -2000px over the full scroll
  const timelineTranslateX = -(scrollProgress * 2000);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 md:opacity-30 transition-opacity duration-700 flex flex-col justify-end pb-4 md:pb-8"
      style={{ 
        maskImage: 'linear-gradient(to bottom, transparent 50%, black 90%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 50%, black 90%)' 
      }}
    >
      {/* Background Grid Lines */}
      <div className="absolute left-0 right-0 bottom-0 top-[50%] flex flex-col justify-end opacity-40 pb-4 md:pb-8">
        <div className="h-[1px] w-full bg-current opacity-10 mb-16"></div>
        <div className="h-[1px] w-full bg-current opacity-10 mb-16"></div>
        <div className="h-[1px] w-full bg-current opacity-10 mb-16"></div>
        <div className="h-[1px] w-full bg-current opacity-10"></div>
      </div>

      {/* Timeline Wrapper (Contains both moving tracks and fixed playhead) */}
      <div className="relative w-full h-[300px] flex overflow-visible origin-bottom scale-[0.6] md:scale-100">
        
        {/* Moving Tracks Container */}
        <div 
          className="absolute top-0 left-0 h-full w-[3000px] flex flex-col justify-between"
          style={{ transform: `translateX(${timelineTranslateX}px)`, transition: 'transform 0.1s linear' }}
        >
          {/* Track 1: Video (Blocks) */}
          <div className="w-full h-[50px] flex items-center gap-4 px-10">
            <div className="h-full w-[300px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[150px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[400px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[250px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[600px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[200px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[500px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
          </div>

          {/* Track 2: B-Roll (Blocks) */}
          <div className="w-full h-[40px] flex items-center gap-4 px-[300px]">
            <div className="h-full w-[200px] border rounded-md" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[100px] border rounded-md ml-[200px]" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[300px] border rounded-md ml-[400px]" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
            <div className="h-full w-[250px] border rounded-md ml-[100px]" style={{ borderColor: strokeColor, backgroundColor: clipFill }}></div>
          </div>

          {/* Ruler / Timecodes */}
          <div className="w-full h-[20px] border-y border-opacity-10 my-2 flex items-center" style={{ borderColor: strokeColor }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[100px] h-full flex flex-col justify-end">
                <span className="text-[10px] ml-1 opacity-40">00:00:{i.toString().padStart(2, '0')}</span>
                <div className="w-[1px] h-[4px] bg-current opacity-40"></div>
              </div>
            ))}
          </div>

          {/* Track 3: Audio (Waveforms) */}
          <div className="w-full h-[60px] flex items-center gap-4 px-10">
            <div className="h-full w-[300px] border rounded-md flex items-center justify-evenly overflow-hidden" style={{ borderColor: strokeColor, backgroundColor: clipFill }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-current opacity-20" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
              ))}
            </div>
            <div className="h-full w-[150px] border rounded-md flex items-center justify-evenly overflow-hidden" style={{ borderColor: strokeColor, backgroundColor: clipFill }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-current opacity-20" style={{ height: `${Math.random() * 60 + 10}%` }}></div>
              ))}
            </div>
            <div className="h-full w-[400px] border rounded-md flex items-center justify-evenly overflow-hidden" style={{ borderColor: strokeColor, backgroundColor: clipFill }}>
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-current opacity-20" style={{ height: `${Math.random() * 90 + 10}%` }}></div>
              ))}
            </div>
            <div className="h-full w-[250px] border rounded-md flex items-center justify-evenly overflow-hidden" style={{ borderColor: strokeColor, backgroundColor: clipFill }}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-current opacity-20" style={{ height: `${Math.random() * 70 + 20}%` }}></div>
              ))}
            </div>
            <div className="h-full w-[600px] border rounded-md flex items-center justify-evenly overflow-hidden" style={{ borderColor: strokeColor, backgroundColor: clipFill }}>
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-current opacity-20" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Playhead (Scrubber) */}
        <div className="absolute top-[-10px] bottom-0 left-[20%] md:left-[30%] w-[2px] z-10" style={{ backgroundColor: accentColor }}>
          {/* Playhead Cap (Top handle) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 rounded-sm flex items-center justify-center" style={{ backgroundColor: accentColor }}>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
