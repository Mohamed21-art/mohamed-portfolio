import React from 'react';

const BottomBar = () => {
  return (
    <div style={{ gridArea: 'bottom', pointerEvents: 'auto', display: 'flex', justifyContent: 'center' }}>
      <div className="panel" style={{ display: 'flex', gap: '1rem', padding: '0.5rem 1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Presets / Snapshots will appear here.</span>
      </div>
    </div>
  );
};

export default BottomBar;
