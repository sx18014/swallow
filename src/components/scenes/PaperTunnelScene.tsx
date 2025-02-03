import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Swallow from '../Swallow';

const vertexShader = /* glsl */`
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate distance from center
    float radius = length(pos.xy);
    float maxRadius = 0.9; // Adjust this to control the circle size
    
    // Create circular mask
    float circle = smoothstep(maxRadius, maxRadius - 0.1, radius);
    
    // Create organic deformation
    float noise1 = snoise(vec2(pos.x * 2.0 + time * 0.1, pos.y * 3.0 + time * 0.01)) * 0.4;
    float noise2 = snoise(vec2(pos.x * 1.0 - time * 0.2, pos.y * 2.0 + time * 0.02)) * 0.3;
    
    // Add asymmetric ripples
    float ripple = sin(radius * 5.0 + time*0.2) * 0.8;
    pos.z += (noise1 + noise2 + ripple) * circle;

    // Add tunnel shape with slight asymmetry
    float tunnelDepth = pow(radius, 2.0) * 0.3;
    pos.z += tunnelDepth * circle;
    
    // Add slight bulging effect
    float bulge = sin(pos.y * 1.0 + time * 0.5) * 0.1;
    pos.x += bulge * circle;

    // Calculate normal based on deformation
    vec3 transformedNormal = normalize(normal + vec3(noise1, noise2, 0.0));
    vNormal = normalMatrix * transformedNormal;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3 color;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Calculate distance from center for circular mask
    float radius = length(vUv - 0.5);
    float circle = 1.0 - smoothstep(0.49, 0.51, radius);
    
    // Basic lighting calculation
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Ambient light
    vec3 ambient = color * 0.98;
    
    // Diffuse light
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = color * diff;
    
    // Add subtle gradient based on radius
    float alpha = 0.2 - smoothstep(0.0, 0.9, radius);
    
    // Add depth-based darkening
    float depth = smoothstep(0.0, 0.5, radius);

    // Add subtle specular highlights
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
    vec3 specular = vec3(0.5) * spec * 0.2;

    // Combine all lighting with subtle wetness effect
    vec3 finalColor = mix(ambient + diffuse + specular, ambient * 1.2, depth * 0.9);
    
    // Apply circular mask with soft edges
    gl_FragColor = vec4(finalColor, circle * (0.95 - depth * 0.5) + alpha * 0.8);
  }
`;

const OrganicLayer: React.FC<{
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
}> = ({ color, position, scale }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={position} scale={scale}>
      {/* Increase segments for smoother circle */}
      <planeGeometry args={[1, 1, 16, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          color: { value: new THREE.Color(color) },
          time: { value: 0 }
        }}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false} // Add this for better transparency handling
        // blending={THREE.AdditiveBlending} // Optional: for a more ethereal effect
      />
    </mesh>
  );
};

const PaperTunnelScene: React.FC = () => {
  const layers = [
    { color: '#ffe1e1', startZ: -20.0, scale: 50.0, opacity: 1.0 },   // Brightest reddish
    { color: '#ffd6d6', startZ: -17.0, scale: 45.0, opacity: 0.98 },  // Very light reddish
    { color: '#ffcece', startZ: -14.0, scale: 35.0, opacity: 0.95 },   // Light reddish
    { color: '#ffc7c7', startZ: -11.0, scale: 25.0, opacity: 0.9 },  // Light warm red
    { color: '#ffbfbf', startZ: -8.0, scale: 17.0, opacity: 0.8 },    // Warm red
    { color: '#ffb8b8', startZ: -6.0, scale: 12.0, opacity: 0.5 },     // Slightly deeper red
    { color: '#ffb0b0', startZ: -4.0, scale: 8.0, opacity: 0.4 },     // Deeper warm red
    { color: '#ffa8a8', startZ: -2.0, scale: 5.0, opacity: 0.3 },     // Rich warm red
    { color: '#ffa1a1', startZ: 0.0, scale: 2, opacity: 0.9 },      // Deepest warm red
  ];
  
  
  
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Base movement speed in Z direction
    state.camera.position.z -= 1 * delta;
  
    // Add subtle swaying motion using sine waves
    const time = state.clock.getElapsedTime();
    
    // Subtle X movement (left-right)
    state.camera.position.x = Math.sin(time * 0.5) * 0.6;
    
    // Slightly different Y movement (up-down)
    state.camera.position.y = Math.cos(time * 0.3) * 0.2;
  
    // Keep camera looking forward by resetting rotation
    state.camera.rotation.set(0, 0, 0);
    // Alternative: explicitly set the camera to look at a point ahead of it
    state.camera.lookAt(new THREE.Vector3(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z - 1
    ));
  
    // Reset layers that are behind the camera
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        const worldPos = child.getWorldPosition(new THREE.Vector3());
        if (worldPos.z > state.camera.position.z + 2) {
          child.position.z -= layers.length * 2.5;
        }
      });
    }
  });
  
  
  
  

  return (
    <group ref={groupRef}>
      <Swallow />
      {layers.map((layer, i) => (
        <OrganicLayer
          key={i}
          position={[0, 0, layer.startZ]}
          scale={[layer.scale, layer.scale, 1]}
          color={layer.color}
        />
      ))}
    </group>
  );
};

export default PaperTunnelScene;
