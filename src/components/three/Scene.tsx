import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Suspense, useState, useRef } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import type { Project } from '../../data/projects';
import { projects } from '../../data/projects';
import { ProjectInfoPanel } from '../ProjectInfoPanel';
import * as THREE from 'three';
import { AnimatePresence } from 'motion/react';

interface PlanetWithPositionProps {
  project: Project;
  index: number;
  totalProjects: number;
  onPlanetClick: (id: string, position: { x: number; y: number }) => void;
  isSelected: boolean;
}

function PlanetWithPosition({ project, index, totalProjects, onPlanetClick, isSelected }: PlanetWithPositionProps) {
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
        const viewCenter = {
          x: size.width / 2,
          y: size.height / 2,
        };
        onPlanetClick(project.id, viewCenter);
        return;
      }

      // Project world position to screen space
      const screenPosition = worldPosition.clone().project(camera);

      // Convert normalized coordinates to pixel coordinates
      const x = (screenPosition.x * 0.5 + 0.5) * size.width;
      const y = (-(screenPosition.y * 0.5) + 0.5) * size.height;

      // Check if the position is within reasonable bounds
      if (isFinite(x) && isFinite(y) && x >= 0 && x <= size.width && y >= 0 && y <= size.height) {
        onPlanetClick(project.id, { x, y });
      } else {
        // Fallback to center if coordinates are invalid
        const viewCenter = {
          x: size.width / 2,
          y: size.height / 2,
        };
        onPlanetClick(project.id, viewCenter);
      }
    }
  };

  return (
    <group>
      <Planet
        ref={meshRef}
        position={getInitialPosition(index, totalProjects, project.planetProps.orbitRadius)}
        {...project.planetProps}
        isSelected={isSelected}
        onClick={handleClick}
      />
    </group>
  );
}

export function Scene() {
  const [selectedPanels, setSelectedPanels] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);

  const handlePlanetClick = (projectId: string, position: { x: number; y: number }) => {
    setSelectedPanels((prev) => {
      const exists = prev.find((panel) => panel.id === projectId);
      if (exists) {
        return prev.filter((panel) => panel.id !== projectId);
      } else {
        return [...prev, { id: projectId, position }];
      }
    });
  };

  const handlePanelClose = (projectId: string) => {
    setSelectedPanels((prev) => prev.filter((panel) => panel.id !== projectId));
  };

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <Canvas
        className="z-[1001]"
        camera={{
          position: [0, 20, 25],
          fov: 45,
          near: 0.1,
          far: 2000,
        }}
      >
        <color attach="background" args={['#000010']} />

        <Suspense fallback={null}>
          {/* Space Environment */}
          <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={0.5} />

          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.5} />
          {/* Main sun light */}
          <pointLight position={[0, 0, 0]} intensity={5} distance={200} decay={1.5} />
          {/* Additional rim lights for better planet visibility */}
          <directionalLight position={[50, 30, -20]} intensity={1} color="#ffffff" />
          <directionalLight position={[-50, -30, 20]} intensity={0.5} color="#ffffff" />
          {/* Soft fill light from the front */}
          <pointLight position={[0, 10, 30]} intensity={0.5} distance={100} decay={2} color="#ffffff" />

          {/* Scene Content */}
          <Sun />

          {/* Planets */}
          {projects.map((project: Project, index: number) => (
            <PlanetWithPosition
              key={project.id}
              project={project}
              index={index}
              totalProjects={projects.length}
              onPlanetClick={handlePlanetClick}
              isSelected={selectedPanels.some((panel) => panel.id === project.id)}
            />
          ))}

          {/* Controls */}
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {selectedPanels.map((panel) => {
          const project = projects.find((p) => p.id === panel.id);
          if (!project) return null;
          return <ProjectInfoPanel key={panel.id} project={project} onClose={() => handlePanelClose(panel.id)} />;
        })}
      </AnimatePresence>
    </div>
  );
}
