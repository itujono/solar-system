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

// Refactored helper component to get screen position
function PlanetWithPosition({
  project,
  index,
  totalProjects,
  onPlanetClick,
}: {
  project: Project;
  index: number;
  totalProjects: number;
  onPlanetClick: (id: string, position: { x: number; y: number }) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
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
    <group onClick={handleClick}>
      <Planet
        ref={meshRef}
        position={getInitialPosition(index, totalProjects, project.planetProps.orbitRadius)}
        {...project.planetProps}
      />
    </group>
  );
}

export function Scene() {
  // Change state to hold multiple selected panels
  const [selectedPanels, setSelectedPanels] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);

  const handlePlanetClick = (projectId: string, position: { x: number; y: number }) => {
    setSelectedPanels((prev) => {
      const exists = prev.find((panel) => panel.id === projectId);
      if (exists) {
        // Toggle off
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
    <div className="h-screen w-screen bg-black relative">
      <Canvas
        camera={{
          position: [0, 20, 25],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={['#000010']} />

        <Suspense fallback={null}>
          {/* Space Environment */}
          <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={0.5} />

          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.2} />
          {/* Main sun light */}
          <pointLight position={[0, 0, 0]} intensity={3} distance={100} decay={2} />
          {/* Additional rim light for better planet visibility */}
          <directionalLight position={[50, 30, -20]} intensity={0.3} color="#ffffff" />

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
            />
          ))}

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 4} // 45 degrees from top
            maxPolarAngle={(Math.PI * 3) / 4} // 135 degrees from top
            minDistance={15}
            maxDistance={50} // Increased max distance
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.5} // Increased zoom speed
            panSpeed={0.8} // Increased pan speed
            screenSpacePanning={true}
            // Removed azimuth angle constraints to allow full rotation
          />
        </Suspense>
      </Canvas>

      {/* Render all selected info panels */}
      <AnimatePresence mode="wait">
        {selectedPanels.map((panel) => {
          const projectData = projects.find((p) => p.id === panel.id);
          if (!projectData) return null;
          return (
            <ProjectInfoPanel
              key={projectData.id}
              project={projectData}
              onClose={() => handlePanelClose(projectData.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Performance optimization components
function AdaptivePixelRatio() {
  return <AdaptiveEvents />;
}

function AdaptiveDpr() {
  return <AdaptiveEvents />;
}

function AdaptiveEvents() {
  return null;
}
