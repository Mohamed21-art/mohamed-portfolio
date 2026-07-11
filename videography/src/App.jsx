import React from 'react';
import Scene from './components/3d/Scene';
import TopBar from './components/ui/TopBar';
import LeftPanel from './components/ui/LeftPanel';
import RightPanel from './components/ui/RightPanel';
import BottomBar from './components/ui/BottomBar';
import './components/ui/ui.css';

function App() {
  return (
    <div className="app-container">
      {/* 3D Viewport underneath everything */}
      <div className="viewport-container">
        <Scene />
      </div>

      {/* Floating UI Layer */}
      <div className="ui-layer">
        <TopBar />
        <LeftPanel />
        <RightPanel />
        <BottomBar />
      </div>
    </div>
  );
}

export default App;
