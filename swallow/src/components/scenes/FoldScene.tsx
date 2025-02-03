import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppState } from '../../store/useAppState';  // Adjust path as needed
import Swallow from '../Swallow';

const FoldScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const setCurrentScene = useAppState(state => state.setCurrentScene);

  // Add scene transition after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScene('TUNNEL');
    }, 100);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timer);
  }, [setCurrentScene]);

  useFrame((state, delta) => {
    // Breathing animation
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime();
      const breathingScale = 1 + Math.sin(time * 2) * 0.1;
      sphereRef.current.scale.set(breathingScale, breathingScale, breathingScale);
    }

    // Add subtle camera movement
    const time = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(time * 0.5) * 0.3;
    state.camera.position.y = Math.cos(time * 0.3) * 0.2;
    state.camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return (
    <group ref={groupRef}>
      <Swallow />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      <pointLight position={[5, -5, 5]} intensity={0.5} />
    </group>
  );
};

export default FoldScene;
