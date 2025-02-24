import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Stars, shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material for the solar flares
const SolarFlareMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#FFD54F'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      float dist = length(vUv - vec2(0.5));
      float alpha = smoothstep(0.5, 0.0, dist);
      alpha *= sin(time * 2.0 + dist * 10.0) * 0.5 + 0.5;
      gl_FragColor = vec4(color, alpha * 0.6);
    }
  `,
);

// Extend Three's Material type for the custom shader
extend({ SolarFlareMaterial });

function SolarFlare({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial & { time: number }>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      // Subtle pulsing scale
      const pulse = 1 + 0.1 * Math.sin(state.clock.elapsedTime + position[0]);
      meshRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[2, 1, 32, 32]} />
      <primitive object={new SolarFlareMaterial()} ref={materialRef} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  // Load sun textures
  const textures = useTexture({
    map: '/textures/sun/sun.jpg',
    displacementMap: '/textures/sun/sun.jpg', // Using same texture for displacement
  });

  // Apply texture transformations
  if (textures.map) {
    textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
    textures.map.repeat.set(1, 1);
  }
  if (textures.displacementMap) {
    textures.displacementMap.wrapS = textures.displacementMap.wrapT = THREE.RepeatWrapping;
    textures.displacementMap.repeat.set(1, 1);
  }

  useFrame((state) => {
    if (sunRef.current) {
      // Slow rotation for the sun's surface
      sunRef.current.rotation.y += 0.001;
    }
    if (coronaRef.current) {
      // Subtle corona pulsation
      const scale = 1 + 0.05 * Math.sin(state.clock.elapsedTime * 0.5);
      coronaRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      {/* Stars background */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <group>
        {/* Main sun sphere with displacement */}
        <mesh ref={sunRef}>
          <sphereGeometry args={[4, 128, 128]} />
          <meshPhysicalMaterial
            map={textures.map}
            displacementMap={textures.displacementMap}
            displacementScale={0.2}
            emissiveMap={textures.map}
            emissive="#FDB813"
            emissiveIntensity={2}
            roughness={0.7}
            metalness={0}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Inner corona glow */}
        <mesh ref={coronaRef}>
          <sphereGeometry args={[4.3, 64, 64]} />
          <meshBasicMaterial
            color="#FDB813"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Outer corona glow */}
        <mesh>
          <sphereGeometry args={[5, 64, 64]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Strong point light at the center */}
        <pointLight intensity={3} distance={100} decay={2} color="#FDB813" />

        {/* Additional ambient glow */}
        <pointLight intensity={2} distance={15} decay={2} color="#FF8C00" />

        {/* Solar flares - positioned more naturally */}
        <group>
          <SolarFlare
            position={[0, 4.1, 0] as [number, number, number]}
            rotation={[0, 0, 0] as [number, number, number]}
          />
          <SolarFlare
            position={[3.8, 1.3, 0] as [number, number, number]}
            rotation={[0, 0, -Math.PI / 4] as [number, number, number]}
          />
          <SolarFlare
            position={[-3.8, -1.3, 0] as [number, number, number]}
            rotation={[0, 0, Math.PI / 4] as [number, number, number]}
          />
        </group>
      </group>
    </>
  );
}
