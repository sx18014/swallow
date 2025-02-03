import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Swallow: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      // Breathing animation
      const time = state.clock.getElapsedTime();
      const breathingScale = 1 + Math.sin(time * 2) * 0.1;
      sphereRef.current.scale.set(breathingScale, breathingScale, breathingScale);

      // Make sphere follow camera
      // Get camera position and direction
      const cameraPosition = state.camera.position;
      const cameraDirection = new THREE.Vector3(0, 0, -0.2);
      cameraDirection.applyQuaternion(state.camera.quaternion);
      
      // Position sphere 5 units in front of camera
      const spherePosition = cameraPosition.clone()
        .add(cameraDirection.multiplyScalar(5));
      
      sphereRef.current.position.copy(spherePosition);
      
      // Make sphere face the camera
      sphereRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial 
        color="white"
        roughness={0.3}
        metalness={0.2}
        emissive="white"
      />
    </mesh>
  );
};

export default Swallow;
