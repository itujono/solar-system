import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import type { Planet as PlanetType } from '../data/planets';
import { Canvas } from '@react-three/fiber';
import { Planet } from './three/Planet';
import { OrbitControls } from '@react-three/drei';
import { CornerUpRightIcon } from 'lucide-react';
import { Suspense } from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface PlanetInfoPanelProps {
  planet: PlanetType;
  onClose: () => void;
}

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1.2,
};

function PreviewPlanet({ planetProps, id }: { planetProps: PlanetType['planetProps']; id: string }) {
  const size = id === 'jupiter' || id === 'saturn' ? 0.7 : 1;
  return <Planet id={id} position={[0, 0, 0]} {...planetProps} size={size} orbitRadius={0} orbitSpeed={0} />;
}

export function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  const [showPlanet, setShowPlanet] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 isolate w-screen h-screen z-[9999] font-mono" onClick={onClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={springTransition}
        onAnimationComplete={() => {
          setShowPlanet(true);
          setIsPanelVisible(true); // Trigger number animations
        }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[90vw] z-[9999] isolate"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-purple-900 rounded-lg" />
        <div className="relative bg-black/80 text-cyan-300 rounded-sm overflow-hidden border border-cyan-500/30 backdrop-blur-xl p-6">
          <AnimatePresence>
            {showPlanet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute bottom-0 right-0 size-full -z-10 isolate"
              >
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full pointer-events-none">
                  <Suspense fallback={null}>
                    <PreviewPlanet planetProps={planet.planetProps} id={planet.id} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <directionalLight position={[0, 0, 5]} intensity={0.8} />
                  </Suspense>
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.0001}
                    enableDamping={false}
                  />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="relative mb-4 lg:pr-32">
            {/* <div className="absolute -left-2 top-1/2 w-1 h-6 bg-cyan-500 -translate-y-1/2" /> */}
            <h2 className="text-lg lg:text-2xl font-bold pl-2 mb-1">///// {planet.name}</h2>
            <p className="text-xs lg:text-sm text-gray-400 pl-2 italic">{planet.trivia}</p>
          </section>

          <p className="text-gray-300 mb-6 pl-2">{planet.description}</p>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 pl-2 flex items-center">
              <span className="w-1 h-1 bg-cyan-500 rounded-full mr-2" />
              ///// Physical Data
            </h3>
            <div className="grid grid-cols-2 gap-3 pl-2">
              <div className="px-4 py-3 bg-white/5 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-1">Diameter (Earth = 1)</div>
                <div className="text-lg font-semibold">
                  <AnimatedNumber
                    value={planet.planetProps.actualSize}
                    format={(v) => v.toFixed(3) + '×'}
                    start={isPanelVisible}
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-1">Distance from Sun</div>
                <div className="text-lg font-semibold">
                  <AnimatedNumber
                    value={planet.planetProps.actualOrbitRadius}
                    format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)} billion` : v.toFixed(1)) + ' km'}
                    start={isPanelVisible}
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-1">Actual Diameter</div>
                <div className="text-lg font-semibold">
                  <AnimatedNumber
                    value={planet.planetProps.actualSize * 12742}
                    format={(v) => v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' km'}
                    start={isPanelVisible}
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-sm text-gray-400 mb-1">Distance (AU)</div>
                <div className="text-lg font-semibold">
                  <AnimatedNumber
                    value={planet.planetProps.actualOrbitRadius / 149.6}
                    format={(v) => v.toFixed(2) + ' AU'}
                    start={isPanelVisible}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 pl-2 flex items-center">
              <span className="w-1 h-1 bg-purple-500 rounded-full mr-2" />
              ///// Notable Features
            </h3>
            <div className="grid grid-cols-2 gap-3 pl-2">
              {planet.features.map((feature) => (
                <div
                  key={feature}
                  className="px-4 py-2 bg-white/5 rounded-lg border border-purple-500/20 backdrop-blur-sm"
                >
                  {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="flex gap-3 pl-2 mt-4 lg:mt-12">
            {planet.links?.nasa && (
              <a
                href={planet.links?.nasa}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-colors flex items-center gap-2"
              >
                NASA Info <CornerUpRightIcon className="size-4" />
              </a>
            )}
            {planet.links?.wiki && (
              <a
                href={planet.links?.wiki}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-colors flex items-center gap-2"
              >
                Wikipedia <CornerUpRightIcon className="size-4" />
              </a>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}
