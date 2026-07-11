import React from 'react';
import { Camera, Settings, Video } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TopBar = () => {
  const { ui, setUI } = useStore();

  return (
    <div style={{ gridArea: 'top', display: 'flex', justifyContent: 'space-between', pointerEvents: 'auto' }}>
      <div className="panel" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
        <Video size={20} color="var(--accent)" />
        <h1 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>Pro Photo Simulator</h1>
      </div>

      <div className="panel" style={{ display: 'flex', gap: '1rem', padding: '0.5rem 1rem' }}>
        <button onClick={() => setUI({ activeTab: 'camera' })} style={{ background: ui.activeTab === 'camera' ? 'var(--accent)' : 'transparent', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={16} /> Camera
        </button>
        <button onClick={() => setUI({ activeTab: 'lights' })} style={{ background: ui.activeTab === 'lights' ? 'var(--accent)' : 'transparent', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={16} /> Lighting
        </button>
      </div>
    </div>
  );
};

export default TopBar;
