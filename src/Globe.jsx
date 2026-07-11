import { useEffect, useState, useMemo } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import * as topojson from "topojson-client";
import worldData from "./world.json";

export default function Globe({ isDarkMode }) {
  const [rotation, setRotation] = useState(0);

  // Convert TopoJSON to GeoJSON once
  const features = useMemo(() => {
    return topojson.feature(worldData, worldData.objects.countries).features;
  }, []);

  useEffect(() => {
    // Only rotate with scroll as requested by the user
    const handleScroll = () => {
      // Slow rotation on Y axis based on scroll position
      setRotation(window.scrollY * 0.15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Setup D3 Projection
  const projection = geoOrthographic()
    .scale(245)
    .translate([250, 250])
    .rotate([rotation, -15]); // Rotate on Y based on scroll, slightly tilted on X

  const pathGenerator = geoPath().projection(projection);
  const graticule = geoGraticule10();

  // Dynamic colors based on theme to blend perfectly
  const outlineColor = isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const gridColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const landStroke = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  const landFill = isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

  return (
    <div className={`fixed top-[-5%] right-[-10%] w-[500px] h-[500px] md:w-[900px] md:h-[900px] pointer-events-none z-0 opacity-30 md:opacity-40 transition-opacity duration-700`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        style={{ transform: 'scale(0.95)' }}
      >
        {/* Globe Base (Outline) */}
        <path 
          d={pathGenerator({ type: "Sphere" })} 
          fill="none" 
          stroke={outlineColor} 
          strokeWidth="1" 
        />
        
        {/* Grid Lines (Latitudes / Longitudes) */}
        <path 
          d={pathGenerator(graticule)} 
          fill="none" 
          stroke={gridColor} 
          strokeWidth="0.5" 
        />
        
        {/* Continents */}
        <g stroke={landStroke} strokeWidth="0.5" fill={landFill}>
          {features.map((feature, i) => (
            <path key={i} d={pathGenerator(feature)} />
          ))}
        </g>
      </svg>
    </div>
  );
}
