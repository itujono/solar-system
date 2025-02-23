import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useState, useRef } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import type { Project } from '../../data/projects';
import { projects } from '../../data/projects';
import { ProjectInfoPanel } from '../ProjectInfoPanel';
import * as THREE from 'three';
import { AnimatePresence } from 'motion/react';

// Helper component to get screen position
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

  const handleClick = () => {
    if (meshRef.current) {
      const vector = new THREE.Vector3();
      meshRef.current.getWorldPosition(vector);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (-(vector.y * 0.5) + 0.5) * size.height;

      onPlanetClick(project.id, { x, y });
    }
  };

  return (
    <Planet
      ref={meshRef}
      position={getInitialPosition(index, totalProjects, project.planetProps.orbitRadius)}
      onClick={handleClick}
      {...project.planetProps}
    />
  );
}

export function Scene() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null);

  const handlePlanetClick = (projectId: string, position: { x: number; y: number }) => {
    if (projectId === selectedProject) {
      setSelectedProject(null);
      setPanelPosition(null);
    } else {
      setSelectedProject(projectId);
      setPanelPosition(position);
    }
  };

  const handlePanelClose = () => {
    setSelectedProject(null);
    setPanelPosition(null);
  };

  const selectedProjectData = selectedProject ? projects.find((p) => p.id === selectedProject) : null;

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
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={15}
            maxDistance={35}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.2}
            panSpeed={0.5}
            screenSpacePanning={true}
            maxAzimuthAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Project Info Panel */}
      <AnimatePresence mode="wait">
        {selectedProjectData && panelPosition && (
          <ProjectInfoPanel
            key={selectedProjectData.id}
            project={selectedProjectData}
            position={panelPosition}
            onClose={handlePanelClose}
          />
        )}
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
