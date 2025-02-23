import { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  atmosphereColor?: string;
  onClick?: (event: { stopPropagation: () => void }) => void;
  textureSet?: {
    map?: string;
    normalMap?: string;
    displacementMap?: string;
    roughnessMap?: string;
    specularMap?: string;
  };
}

// OrbitPath: renders the orbit path of the planet
function OrbitPath({ radius, color }: { radius: number; color: string }) {
  const points = Array.from({ length: 129 }, (_, i) => {
    const theta = (i / 128) * Math.PI * 2;
    return [Math.cos(theta) * radius, 0, Math.sin(theta) * radius] as [number, number, number];
  });

  return (
    <Line points={points} color={color} transparent opacity={0.2} lineWidth={1} blending={THREE.AdditiveBlending} />
  );
}

// PlanetBody: renders the visible sphere with textures and materials
const PlanetBody = forwardRef<
  THREE.Mesh,
  {
    size: number;
    textures: any;
    hovered: boolean;
    onPointerOver: (e: any) => void;
    onPointerOut: (e: any) => void;
  }
>(({ size, textures, hovered, onPointerOver, onPointerOut }, ref) => {
  return (
    <mesh ref={ref} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshPhysicalMaterial
        map={textures?.map}
        normalMap={textures?.normalMap}
        normalScale={[1.5, 1.5]}
        displacementMap={textures?.displacementMap}
        displacementScale={0.05}
        roughnessMap={textures?.roughnessMap}
        roughness={0.6}
        metalness={0.4}
        specularIntensity={hovered ? 0.8 : 0.5}
        clearcoat={hovered ? 0.6 : 0.4}
        clearcoatRoughness={0.3}
        emissiveMap={textures?.map}
        emissiveIntensity={hovered ? 0.6 : 0.4}
        envMapIntensity={1.2}
      />
    </mesh>
  );
});

// PlanetHitbox: an invisible hitbox that exclusively captures pointer events
const PlanetHitbox = ({
  size,
  onPointerUp,
  onPointerOver,
  onPointerOut,
}: {
  size: number;
  onPointerUp?: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}) => {
  return (
    <mesh onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut} renderOrder={999}>
      <sphereGeometry args={[size * 1.3, 32, 32]} />
      <meshBasicMaterial color="black" opacity={0} transparent depthTest={false} />
    </mesh>
  );
};

// Atmosphere: renders the optional atmospheric effect around the planet
const Atmosphere = ({
  size,
  atmosphereColor,
  hovered,
}: {
  size: number;
  atmosphereColor: string;
  hovered: boolean;
}) => {
  return (
    <mesh scale={[1.25, 1.25, 1.25]}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshPhysicalMaterial
        color={atmosphereColor}
        transparent
        opacity={hovered ? 0.25 : 0.15}
        side={THREE.BackSide}
        metalness={0.2}
        roughness={0.2}
        emissive={atmosphereColor}
        emissiveIntensity={hovered ? 0.5 : 0.3}
        depthWrite={false}
      />
    </mesh>
  );
};

export const Planet = forwardRef<THREE.Mesh, PlanetProps>(function Planet(
  { position, orbitRadius, orbitSpeed, rotationSpeed, size, atmosphereColor, onClick, textureSet },
  ref,
) {
  const planetRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load textures if provided
  const textures = textureSet?.map
    ? useTexture({
        map: textureSet.map,
        ...(textureSet.normalMap && { normalMap: textureSet.normalMap }),
        ...(textureSet.displacementMap && { displacementMap: textureSet.displacementMap }),
        ...(textureSet.roughnessMap && { roughnessMap: textureSet.roughnessMap }),
        ...(textureSet.specularMap && { specularMap: textureSet.specularMap }),
      })
    : null;

  if (textures?.map) {
    Object.values(textures).forEach((texture) => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      }
    });
  }

  useFrame((state) => {
    if (planetRef.current && bodyRef.current) {
      const initialAngle = Math.atan2(position[2], position[0]);
      const angle = state.clock.elapsedTime * orbitSpeed + initialAngle;
      planetRef.current.position.x = Math.cos(angle) * orbitRadius;
      planetRef.current.position.z = Math.sin(angle) * orbitRadius;
      bodyRef.current.rotation.y += rotationSpeed;
      const targetScale = hovered ? 1.1 : 1;
      bodyRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handlePointerOver = (e: any) => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <>
      <OrbitPath radius={orbitRadius} color={atmosphereColor || '#ffffff'} />
      <group ref={planetRef} position={position}>
        <PlanetBody
          ref={ref || bodyRef}
          size={size}
          textures={textures}
          hovered={hovered}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
        <PlanetHitbox
          size={size}
          onPointerUp={onClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
        {atmosphereColor && <Atmosphere size={size} atmosphereColor={atmosphereColor} hovered={hovered} />}
        <pointLight intensity={hovered ? 1.2 : 0.8} distance={15} color={atmosphereColor || '#ffffff'} decay={2} />
      </group>
    </>
  );
});
