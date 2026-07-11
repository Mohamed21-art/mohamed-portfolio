import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sphere, Box, Plane } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const ExposureController = () => {
  const { gl } = useThree();
  const { camera } = useStore();

  useEffect(() => {
    // Calculate Exposure Value (EV)
    // EV = log2(N^2 / t) at ISO 100
    // If ISO changes, we adjust it: EV_100 = EV - log2(ISO/100)
    // But directly calculating exposure multiplier for tone mapping:
    // exposure = (t * ISO) / (N^2 * 100) * some_base_constant
    
    // In Three.js with ACESFilmicToneMapping, exposure = 1 is default.
    // Let's create a physical-ish mapping.
    const { aperture, shutterSpeed, iso } = camera;
    
    // Physical exposure formula approximation for Three.js
    // We scale it by a constant to look good in the default PBR setup
    const baseConstant = 100; 
    const calculatedExposure = (shutterSpeed * iso) / (Math.pow(aperture, 2) * 100) * baseConstant;
    
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = calculatedExposure;
  }, [camera.aperture, camera.shutterSpeed, camera.iso, gl]);

  return null;
};

const Lights = () => {
  const { lights } = useStore();

  return (
    <>
      {/* Ambient base so it's not pitch black, simulating bounce */}
      <ambientLight intensity={0.05} />
      
      {lights.map((light) => {
        // Convert Color Temp (K) to RGB - simplified approximation for Threejs
        // Normally you'd use a proper Kelvin to RGB function, but Three.js Color has some util or we can just pass a hex/color name. 
        // For now we'll just let it be white and we can refine color temp later.
        
        return (
          <pointLight
            key={light.id}
            position={light.position}
            intensity={light.intensity} // Using Three.js physically correct lights (decay = 2)
            decay={2}
            distance={20}
            castShadow
          />
        );
      })}
    </>
  );
};

const Scene = () => {
  const { camera } = useStore();

  return (
    <Canvas shadows gl={{ physicallyCorrectLights: true }}>
      <ExposureController />
      <PerspectiveCamera 
        makeDefault 
        position={[0, 1.5, 5]} 
        fov={camera.focalLength === 50 ? 45 : (50 / camera.focalLength) * 45} // Very rough FOV approximation
      />
      <OrbitControls target={[0, 1, 0]} />
      
      <color attach="background" args={['#0a0a0a']} />
      
      <Lights />

      {/* Subjects */}
      <group position={[0, 0, 0]}>
        <Sphere args={[0.5, 64, 64]} position={[-0.8, 0.5, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.8} clearcoat={1} />
        </Sphere>

        <Box args={[0.8, 1.2, 0.8]} position={[0.8, 0.6, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#ff4757" roughness={0.7} metalness={0.1} />
        </Box>

        <Sphere args={[0.4, 32, 32]} position={[0, 0.4, 1.5]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#4cd137" roughness={0.4} metalness={0.2} />
        </Sphere>
      </group>

      {/* Studio Floor / Backdrop */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshPhysicalMaterial color="#222222" roughness={0.9} />
      </Plane>
      <Plane args={[50, 50]} position={[0, 25, -5]} receiveShadow>
        <meshPhysicalMaterial color="#222222" roughness={0.9} />
      </Plane>

      <Environment preset="studio" environmentIntensity={0.1} />

      {/* Postprocessing */}
      <EffectComposer disableNormalPass>
        <DepthOfField 
          target={[0, 1, camera.focusDistance - 5]} // -5 offset because camera is at z=5
          focalLength={camera.focalLength / 1000} // converting mm to m approximation
          bokehScale={(22 - camera.aperture) * 0.5} // Larger aperture (smaller f-number) = more bokeh
          height={480}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
