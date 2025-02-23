import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Project } from '../data/projects';

interface ProjectInfoPanelProps {
  project: Project;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
}

export function ProjectInfoPanel({ project, position, onClose }: ProjectInfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Calculate panel position to ensure it stays within viewport
  const panelWidth = 320; // w-80 = 20rem = 320px
  const panelHeight = 400; // Approximate height
  const margin = 20;

  const x = Math.min(Math.max(position.x, margin), window.innerWidth - panelWidth - margin);
  const y = Math.min(Math.max(position.y, margin), window.innerHeight - panelHeight - margin);

  const springTransition = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 1,
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
          ...springTransition,
          stiffness: 400, // Slightly softer for exit
          damping: 25,
        },
      }}
      transition={springTransition}
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '320px',
        pointerEvents: 'auto', // Ensure clickability during exit animation
      }}
    >
      {/* Tech border effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main panel */}
      <motion.div
        className="relative bg-black/95 text-white rounded-lg overflow-hidden border border-white/10 backdrop-blur-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Decorative tech elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%'],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-2xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Content */}
        <div className="p-6">
          {/* Header with tech decoration */}
          <div className="relative mb-4">
            <motion.div
              className="absolute -left-2 top-1/2 w-1 h-6 bg-cyan-500 -translate-y-1/2"
              animate={{
                height: ['24px', '16px', '24px'],
              }}
              exit={{ height: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.h2 className="text-2xl font-bold pl-2" exit={{ opacity: 0, x: -10 }} transition={springTransition}>
              {project.name}
            </motion.h2>
          </div>

          <motion.p
            className="text-gray-300 mb-4 pl-2"
            exit={{ opacity: 0, x: -10 }}
            transition={{ ...springTransition, delay: 0.05 }}
          >
            {project.description}
          </motion.p>

          {/* Technologies with modern styling */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 pl-2 flex items-center">
              <motion.span
                className="w-1 h-1 bg-purple-500 rounded-full mr-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                exit={{ scale: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2 pl-2">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: -10,
                    transition: {
                      ...springTransition,
                      delay: index * 0.03, // Staggered exit
                    },
                  }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  }}
                  className="px-3 py-1 bg-white/5 rounded-full text-sm border border-white/10 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Links with modern styling */}
          {project.links && (
            <div className="flex gap-3 pl-2">
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-white/10 flex items-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { ...springTransition, delay: 0.1 },
                  }}
                >
                  <motion.span
                    className="w-1 h-1 bg-cyan-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    exit={{ scale: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  GitHub
                </motion.a>
              )}
              {project.links.live && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-white/10 flex items-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { ...springTransition, delay: 0.15 },
                  }}
                >
                  <motion.span
                    className="w-1 h-1 bg-purple-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    exit={{ scale: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  Live Demo
                </motion.a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
