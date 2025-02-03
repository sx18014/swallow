// src/components/scenes/TunnelScene.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const TunnelScene: React.FC = () => {
  // If you need to group multiple objects, you can also use a group ref
  const sphereRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      // A simple "breathing" scale: oscillate between 0.9 and 1.1
      const time = state.clock.getElapsedTime();
      const scale = 1 + 0.1 * Math.sin(time * 2); 
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sphereRef} position={[0, 1, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};



export default TunnelScene;


