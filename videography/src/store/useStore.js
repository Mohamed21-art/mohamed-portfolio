import { create } from 'zustand';

export const useStore = create((set) => ({
  // --- Camera State ---
  camera: {
    iso: 100, // 100 - 25600
    shutterSpeed: 1 / 100, // in seconds, e.g. 1/100
    aperture: 2.8, // f-stop
    focalLength: 50, // mm
    focusDistance: 2, // meters
    whiteBalance: 5600, // Kelvin
    sensorSize: 'full-frame', // 'full-frame', 'aps-c', 'iphone17'
  },
  updateCamera: (updates) => set((state) => ({ camera: { ...state.camera, ...updates } })),

  // --- Lighting State ---
  lights: [
    {
      id: 'light-1',
      type: 'area', // 'area', 'spot'
      name: 'Key Light',
      intensity: 1000, // Lumens or standard unit
      colorTemp: 5600, // Kelvin
      position: [2, 2, 2], // [x, y, z]
      target: [0, 0, 0], // point it's looking at
      width: 1, // for area light
      height: 1, // for area light
    },
    {
      id: 'light-2',
      type: 'area',
      name: 'Fill Light',
      intensity: 300,
      colorTemp: 4500,
      position: [-2, 1.5, 2],
      target: [0, 0, 0],
      width: 2,
      height: 2,
    }
  ],
  updateLight: (id, updates) => set((state) => ({
    lights: state.lights.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  addLight: (light) => set((state) => ({ lights: [...state.lights, { id: `light-${Date.now()}`, ...light }] })),
  removeLight: (id) => set((state) => ({ lights: state.lights.filter(l => l.id !== id) })),

  // --- UI State ---
  ui: {
    selectedLightId: 'light-1',
    activeTab: 'camera', // 'camera', 'lights', 'environment'
    showMinimap: false,
  },
  setUI: (updates) => set((state) => ({ ui: { ...state.ui, ...updates } })),
}));
