import React from 'react';
import { Sun, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const LeftPanel = () => {
  const { ui, lights, addLight, removeLight, updateLight, setUI } = useStore();

  if (ui.activeTab !== 'lights') return <div style={{ gridArea: 'left' }}></div>;

  const handleAddLight = () => {
    addLight({
      type: 'area',
      name: `Light ${lights.length + 1}`,
      intensity: 500,
      colorTemp: 5600,
      position: [0, 2, 2],
      target: [0, 0, 0],
      width: 1, height: 1
    });
  };

  const selectedLight = lights.find(l => l.id === ui.selectedLightId) || lights[0];

  return (
    <div className="panel panel-container" style={{ gridArea: 'left', width: '300px' }}>
      <div className="panel-header">
        <Sun size={16} /> Lighting Setup
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {lights.map(light => (
          <div 
            key={light.id} 
            onClick={() => setUI({ selectedLightId: light.id })}
            style={{ 
              padding: '0.5rem', 
              background: ui.selectedLightId === light.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${ui.selectedLightId === light.id ? 'var(--accent)' : 'var(--border-color)'}`,
              borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}
          >
            <span>{light.name}</span>
            <button onClick={(e) => { e.stopPropagation(); removeLight(light.id); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={handleAddLight} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border-color)', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={14} /> Add Light
        </button>
      </div>

      {selectedLight && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div className="control-group">
            <label>Intensity (Lumens) <span>{selectedLight.intensity}</span></label>
            <input type="range" className="slider-input" min="0" max="5000" step="50" value={selectedLight.intensity} onChange={e => updateLight(selectedLight.id, { intensity: Number(e.target.value) })} />
          </div>
          
          <div className="control-group">
            <label>Color Temp (K) <span>{selectedLight.colorTemp}K</span></label>
            <input type="range" className="slider-input" min="2000" max="10000" step="100" value={selectedLight.colorTemp} onChange={e => updateLight(selectedLight.id, { colorTemp: Number(e.target.value) })} />
          </div>

          <div className="control-group">
            <label>Position X <span>{selectedLight.position[0].toFixed(1)}</span></label>
            <input type="range" className="slider-input" min="-5" max="5" step="0.1" value={selectedLight.position[0]} onChange={e => updateLight(selectedLight.id, { position: [Number(e.target.value), selectedLight.position[1], selectedLight.position[2]] })} />
          </div>
          <div className="control-group">
            <label>Position Y <span>{selectedLight.position[1].toFixed(1)}</span></label>
            <input type="range" className="slider-input" min="-1" max="5" step="0.1" value={selectedLight.position[1]} onChange={e => updateLight(selectedLight.id, { position: [selectedLight.position[0], Number(e.target.value), selectedLight.position[2]] })} />
          </div>
          <div className="control-group">
            <label>Position Z <span>{selectedLight.position[2].toFixed(1)}</span></label>
            <input type="range" className="slider-input" min="-5" max="5" step="0.1" value={selectedLight.position[2]} onChange={e => updateLight(selectedLight.id, { position: [selectedLight.position[0], selectedLight.position[1], Number(e.target.value)] })} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
