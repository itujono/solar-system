import { motion } from 'motion/react';
import { useEffect } from 'react';
import type { Project } from '../data/projects';

interface ProjectInfoPanelProps {
  project: Project;
  onClose: () => void;
}

const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 26,
  mass: 1,
};

export function ProjectInfoPanel({ project, onClose }: ProjectInfoPanelProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    // Overlay that covers the entire viewport
    <div onClick={onClose} className="fixed inset-0 w-screen h-screen z-1000">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={springTransition}
        className="fixed left-1/2 top-1/2 w-[40rem] pointer-events-auto z-[1001] translate-x-[-50%] translate-y-[-50%]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg" />
        <div className="relative bg-black/95 text-white rounded-lg overflow-hidden border border-white/10 backdrop-blur-xl p-6">
          <div className="relative mb-4">
            <div className="absolute -left-2 top-1/2 w-1 h-6 bg-cyan-500 -translate-y-1/2" />
            <h2 className="text-2xl font-bold pl-2 mb-2">{project.name}</h2>
          </div>
          <p className="text-gray-300 mb-4 pl-2">{project.description}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 pl-2 flex items-center">
              <span className="w-1 h-1 bg-purple-500 rounded-full mr-2" />
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2 pl-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {project.links && (
            <div className="flex gap-3 pl-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-colors"
                >
                  GitHub
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
