const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

// Add Ihram import
if (!code.includes('Ihram-thumbnail.webp')) {
    code = code.replace(
        /import sanwakThumbnail from '\.\/assets\/Sanwak-thumbnail\.webp';/,
        "import sanwakThumbnail from './assets/Sanwak-thumbnail.webp';\nimport ihramThumbnail from './assets/Ihram-thumbnail.webp';"
    );
}

// Find projects array
const projectsStartIndex = code.indexOf('const projects = [');
const projectsEndIndex = code.indexOf('];', projectsStartIndex);

const newProjectStr = `    {
      id: 1,
      clientName: "Knoz",
      avatar: logoKnoz,
      title: "Ihram Capsule Garment — Product Ad",
      type: "Ihram — Capsule-Fastening Garment for Hajj & Umrah\\nA product ad, crafted end to end.",
      thumbnail: ihramThumbnail
    },
    {
      id: 2,
      clientName: "Sanowak",
      avatar: knozLogo,
      title: "SANOWAK — Short-Form Product Ad",
      type: "SANOWAK — Natural Siwak Toothbrush\\nA 20-second product ad, crafted end to end.",
      thumbnail: sanwakThumbnail,
      link: "https://player.vimeo.com/video/1211359609?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 3,
      clientName: "Knoz",
      avatar: logoKnoz,
      title: "Smart Athan Clock — Product Ad",
      type: "Smart Athan Clock\\nA product ad, crafted end to end.",
      thumbnail: clockThumbnail,
      link: "https://player.vimeo.com/video/1211622815?badge=0&autopause=0&player_id=0&app_id=58479"
    },
    {
      id: 4,
      clientName: "AURA BEAUTY",
      title: "Summer Collection",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?q=75&w=800&fm=webp&auto=format&fit=crop"
    },
    {
      id: 5,
      clientName: "TECHNOCORE",
      title: "Product Teaser",
      type: "Motion & Editing",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=75&w=800&h=1000&fm=webp"
    }`;

const before = code.substring(0, projectsStartIndex);
const after = code.substring(projectsEndIndex);

code = before + 'const projects = [\n' + newProjectStr + '\n  ' + after;

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx updated with Ihram project');
