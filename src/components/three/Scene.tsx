import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Suspense, useState, useRef } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import type { Planet as PlanetType } from '../../data/planets';
import { planets } from '../../data/planets';
import { PlanetInfoPanel } from '../PlanetInfoPanel';
import * as THREE from 'three';
import { AnimatePresence } from 'motion/react';

interface PlanetWithPositionProps {
  planet: PlanetType;
  index: number;
  totalPlanets: number;
  onPlanetClick: (id: string) => void;
  isSelected: boolean;
}

function PlanetWithPosition({ planet, index, totalPlanets, onPlanetClick, isSelected }: PlanetWithPositionProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  const getInitialPosition = (idx: number, total: number, radius: number): [number, number, number] => {
    const angle = (idx / total) * Math.PI * 2;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (meshRef.current) {
      // Get the world position of the planet
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);

      // Get the vector from camera to planet
      const cameraPosition = new THREE.Vector3();
      camera.getWorldPosition(cameraPosition);
      const directionToCamera = worldPosition.clone().sub(cameraPosition);

      // Check if planet is behind the camera
      const isBehindCamera = directionToCamera.dot(camera.getWorldDirection(new THREE.Vector3())) < 0;

      if (isBehindCamera) {
        // If planet is behind camera, use a position in front of the camera
        onPlanetClick(planet.id);
        return;
      }

      // Project world position to screen space
      const screenPosition = worldPosition.clone().project(camera);

      // Convert normalized coordinates to pixel coordinates
      const x = (screenPosition.x * 0.5 + 0.5) * size.width;
      const y = (-(screenPosition.y * 0.5) + 0.5) * size.height;

      // Check if the position is within reasonable bounds
      if (isFinite(x) && isFinite(y) && x >= 0 && x <= size.width && y >= 0 && y <= size.height) {
        onPlanetClick(planet.id);
      } else {
        // Fallback to center if coordinates are invalid
        onPlanetClick(planet.id);
      }
    }
  };

  return (
    <group>
      <Planet
        ref={meshRef}
        id={planet.id}
        position={getInitialPosition(index, totalPlanets, planet.planetProps.orbitRadius)}
        {...planet.planetProps}
        isSelected={isSelected}
        onClick={handleClick}
      />
    </group>
  );
}

export function Scene() {
  const [selectedPanels, setSelectedPanels] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);

  const handlePlanetClick = (projectId: string) => {
    setSelectedPanels((prev) => {
      const exists = prev.find((panel) => panel.id === projectId);
      if (exists) {
        return prev.filter((panel) => panel.id !== projectId);
      } else {
        return [
          ...prev,
          {
            id: projectId,
            position: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            },
          },
        ];
      }
    });
  };

  const handlePanelClose = (projectId: string) => {
    setSelectedPanels((prev) => prev.filter((panel) => panel.id !== projectId));
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <Canvas
        className="absolute inset-0"
        camera={{
          position: [0, 35, 45],
          fov: 40,
          near: 0.1,
          far: 2000,
        }}
      >
        <color attach="background" args={['#000010']} />

        <Suspense fallback={null}>
          <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={0.5} />
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={5} distance={200} decay={1.5} />
          <directionalLight position={[50, 30, -20]} intensity={1} color="#ffffff" />
          <directionalLight position={[-50, -30, 20]} intensity={0.5} color="#ffffff" />
          <pointLight position={[0, 10, 30]} intensity={0.5} distance={100} decay={2} color="#ffffff" />

          <Sun />

          {planets.map((planet: PlanetType, index: number) => (
            <PlanetWithPosition
              key={planet.id}
              planet={planet}
              index={index}
              totalPlanets={planets.length}
              onPlanetClick={handlePlanetClick}
              isSelected={selectedPanels.some((panel) => panel.id === planet.id)}
            />
          ))}

          <OrbitControls
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 2.2}
            panSpeed={0.5}
            screenSpacePanning={true}
            maxDistance={100}
            minDistance={20}
          />
        </Suspense>
      </Canvas>

      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {selectedPanels.map((panel) => {
            const planet = planets.find((p) => p.id === panel.id);
            if (!planet) return null;
            return (
              <div key={panel.id} className="pointer-events-auto">
                <PlanetInfoPanel planet={planet} onClose={() => handlePanelClose(panel.id)} />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
