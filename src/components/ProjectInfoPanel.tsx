import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';
import { Canvas } from '@react-three/fiber';
import { Planet } from './three/Planet';
import { OrbitControls } from '@react-three/drei';

interface ProjectInfoPanelProps {
  project: Project;
  onClose: () => void;
}

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1.2,
};

// Preview planet component with simplified props
function PreviewPlanet({ planetProps }: { planetProps: Project['planetProps'] }) {
  return <Planet position={[0, 0, 0]} {...planetProps} size={planetProps.size} orbitRadius={0} orbitSpeed={0} />;
}

export function ProjectInfoPanel({ project, onClose }: ProjectInfoPanelProps) {
  const [showPlanet, setShowPlanet] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 w-screen h-screen z-[1003]">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={springTransition}
        onAnimationComplete={() => setShowPlanet(true)}
        className="fixed left-1/2 top-1/2 w-[40rem] pointer-events-auto z-[1004] translate-x-[-50%] translate-y-[-50%] will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg" />
        <div className="relative bg-black/95 text-white rounded-2xl overflow-hidden border border-white/30 backdrop-blur-xl p-6">
          {/* Planet Preview */}
          <AnimatePresence>
            {showPlanet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute -right-8 -top-8 size-48 select-none"
              >
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full">
                  {/* Enhanced preview lighting */}
                  <ambientLight intensity={0.7} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <directionalLight position={[0, 0, 5]} intensity={0.8} />
                  <PreviewPlanet planetProps={project.planetProps} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                    enableDamping={false}
                  />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mb-4 pr-32">
            <div className="absolute -left-2 top-1/2 w-1 h-6 bg-cyan-500 -translate-y-1/2" />
            <h2 className="text-2xl font-bold pl-2 mb-1">{project.name}</h2>
            <p className="text-sm text-gray-400 pl-2 italic">{project.trivia}</p>
          </div>

          <p className="text-gray-300 mb-6 pl-2">{project.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 pl-2 flex items-center">
              <span className="w-1 h-1 bg-purple-500 rounded-full mr-2" />
              Notable Features
            </h3>
            <div className="grid grid-cols-2 gap-3 pl-2">
              {project.features.map((feature) => (
                <div key={feature} className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pl-2">
            {project.links?.nasa && (
              <a
                href={project.links.nasa}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-colors"
              >
                NASA Info
              </a>
            )}
            {project.links?.wiki && (
              <a
                href={project.links.wiki}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-colors"
              >
                Wikipedia
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
