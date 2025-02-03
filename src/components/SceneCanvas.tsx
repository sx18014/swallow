import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import SceneRouter from './SceneRouter';

const SceneCanvas: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Set background color to dark grey instead of pure black for testing */}
      {/* <color attach="background" args={['#ffe1e1']} /> */}
      
      <Suspense fallback={null}>
        {/* Increase ambient light intensity */}
        <ambientLight intensity={0.9} />
        
        {/* Move directional light in front of camera */}
        <directionalLight 
          position={[0, 0, 11]}
          intensity={1.5}
        />

        <SceneRouter />
        <OrbitControls />

      </Suspense>
    </Canvas>
  );
};


export default SceneCanvas;
