import React from 'react';
import { Camera as CameraIcon, Aperture } from 'lucide-react';
import { useStore } from '../../store/useStore';

const RightPanel = () => {
  const { ui, camera, updateCamera } = useStore();

  if (ui.activeTab !== 'camera') return <div style={{ gridArea: 'right' }}></div>;

  return (
    <div className="panel panel-container" style={{ gridArea: 'right', width: '300px' }}>
      <div className="panel-header">
        <CameraIcon size={16} /> Camera Settings
      </div>

      <div className="control-group">
        <label>Sensor Size</label>
        <select 
          className="select-input" 
          value={camera.sensorSize} 
          onChange={e => updateCamera({ sensorSize: e.target.value })}
        >
          <option value="full-frame">Full Frame (35mm)</option>
          <option value="aps-c">APS-C</option>
          <option value="iphone17">iPhone 17 Pro Max</option>
        </select>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>

      <div className="panel-header" style={{ marginTop: '0.5rem' }}>
        <Aperture size={16} /> Exposure Triangle
      </div>

      <div className="control-group">
        <label>Aperture (f/{camera.aperture})</label>
        <input 
          type="range" className="slider-input" 
          min="1.2" max="22" step="0.1" 
          value={camera.aperture} 
          onChange={e => updateCamera({ aperture: Number(e.target.value) })} 
        />
      </div>

      <div className="control-group">
        <label>ISO ({camera.iso})</label>
        <input 
          type="range" className="slider-input" 
          min="50" max="25600" step="50" 
          value={camera.iso} 
          onChange={e => updateCamera({ iso: Number(e.target.value) })} 
        />
      </div>

      <div className="control-group">
        <label>Shutter Speed (1/{Math.round(1/camera.shutterSpeed)})</label>
        <input 
          type="range" className="slider-input" 
          min="0.00025" max="0.5" step="0.001" 
          value={camera.shutterSpeed} 
          onChange={e => updateCamera({ shutterSpeed: Number(e.target.value) })} 
        />
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>

      <div className="control-group">
        <label>Focal Length ({camera.focalLength}mm)</label>
        <input 
          type="range" className="slider-input" 
          min="12" max="200" step="1" 
          value={camera.focalLength} 
          onChange={e => updateCamera({ focalLength: Number(e.target.value) })} 
        />
      </div>

      <div className="control-group">
        <label>Focus Distance ({camera.focusDistance.toFixed(1)}m)</label>
        <input 
          type="range" className="slider-input" 
          min="0.3" max="10" step="0.1" 
          value={camera.focusDistance} 
          onChange={e => updateCamera({ focusDistance: Number(e.target.value) })} 
        />
      </div>
    </div>
  );
};

export default RightPanel;
