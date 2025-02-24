import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface SaturnRingProps {
  planetSize: number;
  hovered: boolean;
}

export function SaturnRing({ planetSize, hovered }: SaturnRingProps) {
  const texture = useTexture('/textures/saturn/saturn-ring.png');
  const ringRef = useRef<THREE.Mesh>(null);

  // Increase segments for smoother ring
  const segments = 180; // Even more segments for smoother appearance

  // Adjust ring proportions to be thinner
  const innerRadius = planetSize * 1.4;
  const outerRadius = planetSize * 2.1; // Reduced outer radius for more accurate proportions

  // Adjust tilt for classic Saturn view
  const tiltAngle = (15 * Math.PI) / 180; // Reduced tilt for better visibility

  useFrame(({ clock }) => {
    if (ringRef.current) {
      // Match planet rotation speed
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  // Configure texture for better ring appearance
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1); // Repeat texture for more detail
  texture.needsUpdate = true;

  return (
    <group rotation={[tiltAngle, 0, 0]}>
      <mesh ref={ringRef} receiveShadow castShadow>
        <ringGeometry args={[innerRadius, outerRadius, segments]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.3}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.15 : 0.08}
          depthWrite={true}
          alphaTest={0.2}
          blending={THREE.AdditiveBlending} // Added additive blending for better transparency
        />
      </mesh>
    </group>
  );
}
