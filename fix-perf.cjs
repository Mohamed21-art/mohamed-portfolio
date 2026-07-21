const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update hero image
code = code.replace(/import heroBg from '\.\/assets\/d59f90ac-4ec9-49ef-a568-b4420caa1e3f\.jpeg';/, "import heroBg from './assets/hero-bg.jpg';");

// 2. Remove framer-motion useTransform
code = code.replace(/import { motion, useScroll, useTransform } from 'framer-motion';/, "import { motion, useScroll } from 'framer-motion';");

// 3. Remove unused state variables
code = code.replace(/  const \[cursorPos, setCursorPos\] = useState\(\{ x: -100, y: -100 \}\);\n/, "");
code = code.replace(/  const \[isHovering, setIsHovering\] = useState\(false\);\n/, "");

// 4. Remove insights progress
code = code.replace(/  const insightsRef = useRef\(null\);\n  const { scrollYProgress: insightsProgress } = useScroll\({\n    target: insightsRef,\n    offset: \["start 90%", "end 80%"\]\n  }\);\n/, "");

// 5. Remove custom cursor effect
code = code.replace(/  \/\/ Custom Cursor\n  useEffect\(\(\) => \{\n(?:    .*\n)*  \}, \[\]\);\n\n/, "");

// 6. Fix catch block
code = code.replace(/      \} else \{\n        setFormStatus\('error'\);\n      \}\n    \} catch \(error\) \{/g, "      if (!response.ok) throw new Error('Failed');\n        setFormStatus('success');\n        form.reset();\n    } catch (error) {");

// 7. Update Unsplash images w=2000 -> w=800&q=75&fm=webp
code = code.replace(/q=80&w=2000/g, "q=75&w=800&fm=webp");

// 8. Add fetchpriority to hero image
code = code.replace(/className="w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40 blur-\[3px\]"/, 'className="w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40 blur-[3px]"\n          fetchpriority="high"');

// 9. Add loading="lazy" to avatars
code = code.replace(/<img src=\{project.avatar\} alt=\{project.clientName\} className="w-full h-full object-cover" \/>/g, '<img src={project.avatar} alt={project.clientName} loading="lazy" className="w-full h-full object-cover" />');

fs.writeFileSync('src/App.jsx', code);
console.log("App.jsx fixed");
