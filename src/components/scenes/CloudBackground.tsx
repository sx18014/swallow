import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const CloudBackground: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: 'linear-gradient(to bottom, #cfd0d1, #ffffff)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 10]}
            intensity={20} />
        
        <Clouds material={THREE.MeshToonMaterial} limit={100}>
          <Cloud
            color="#fff5f5"  // Pure white
            position={[-5, 2, -6]}
            opacity={0.5}
            speed={0.3} // Rotation speed
            segments={50} // Number of particles
          />
          <Cloud
            color="#fff5f5"  // Very slight warm white
            position={[4, -2, -6]}
            opacity={0.6}
            speed={0.3}
            segments={20}
          />
          <Cloud
            color="#ffa8a8"  // Ghost white
            position={[2, 5, -7]}
            opacity={0.6}
            speed={0.6}
            segments={20}
          />
          <Cloud
            color="#ffa8a8"  // Ghost white
            position={[0, 4, -7]}
            opacity={0.2}
            speed={0.2}
            segments={20}
          />
          <Cloud
            color="#ffa8a8"  // Ghost white
            position={[-2, -4, -7]}
            opacity={0.6}
            speed={0.2}
            segments={20}
          />
          <Cloud
            color="#fffafa"  // Snow white
            position={[-3, 0, -7]}
            opacity={0.65}
            speed={0.35}
            segments={50}
          />
          <Cloud
            color="#ffffff"  // Pure white
            position={[5, 1, -5]}
            opacity={0.2}
            speed={0.45}
            segments={30}
          />
        </Clouds>
      </Canvas>
    </div>
  );
};

export default CloudBackground;
