export interface Planet {
  id: string;
  name: string;
  description: string;
  features: string[];
  trivia: string;
  planetProps: {
    orbitRadius: number; // For visualization
    actualOrbitRadius: number; // In millions of kilometers
    orbitSpeed: number;
    rotationSpeed: number;
    size: number; // For visualization
    actualSize: number; // Diameter relative to Earth (Earth = 1)
    atmosphereColor?: string;
    textureSet?: {
      map?: string;
      normalMap?: string;
      displacementMap?: string;
      roughnessMap?: string;
      specularMap?: string;
    };
  };
  links?: {
    nasa?: string;
    wiki?: string;
  };
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    description:
      'The smallest and innermost planet in the Solar System, Mercury is also the fastest, completing an orbit around the Sun in just 88 Earth days.',
    features: ['Smallest Planet', 'Closest to Sun', 'No Moons', 'Extreme Temperatures'],
    trivia: 'Known to ancient civilizations as Hermes by Greeks and Mercurius by Romans',
    planetProps: {
      orbitRadius: 10,
      actualOrbitRadius: 57.9, // 57.9 million km from Sun
      orbitSpeed: 0.05,
      rotationSpeed: 0.004,
      size: 0.8,
      actualSize: 0.383, // 0.383 times Earth's diameter
      atmosphereColor: '#A0522D',
      textureSet: {
        map: '/textures/mercury/mercury.jpg',
        normalMap: '/textures/mercury/mercury.jpg',
        displacementMap: '/textures/mercury/mercury.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/mercury',
      wiki: 'https://en.wikipedia.org/wiki/Mercury_(planet)',
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    description:
      "Often called Earth's sister planet due to similar size, Venus has a toxic atmosphere and surface temperatures hot enough to melt lead.",
    features: ['Hottest Planet', 'Spins Backwards', 'Dense Atmosphere', "90x Earth's Pressure"],
    trivia: 'Named after the Roman goddess of love and beauty',
    planetProps: {
      orbitRadius: 15,
      actualOrbitRadius: 108.2, // 108.2 million km from Sun
      orbitSpeed: 0.035,
      rotationSpeed: 0.002,
      size: 0.95,
      actualSize: 0.949, // 0.949 times Earth's diameter
      atmosphereColor: '#FFA07A',
      textureSet: {
        map: '/textures/venus/venus.jpg',
        normalMap: '/textures/venus/venus.jpg',
        displacementMap: '/textures/venus/venus.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/venus',
      wiki: 'https://en.wikipedia.org/wiki/Venus',
    },
  },
  {
    id: 'earth',
    name: 'Earth',
    description:
      'Our home planet is the only known world to support life. With its diverse ecosystems and liquid water, Earth is unique in the Solar System.',
    features: ['Only Known Life', 'One Moon', '71% Water Surface', '24hr Day Cycle'],
    trivia: 'The only planet not named after a Greek or Roman deity',
    planetProps: {
      orbitRadius: 20,
      actualOrbitRadius: 149.6, // 149.6 million km from Sun (1 AU)
      orbitSpeed: 0.025,
      rotationSpeed: 0.003,
      size: 1,
      actualSize: 1, // Reference size (12,742 km diameter)
      atmosphereColor: '#4169E1',
      textureSet: {
        map: '/textures/earth/earth.jpg',
        normalMap: '/textures/earth/earth.jpg',
        displacementMap: '/textures/earth/earth.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/earth',
      wiki: 'https://en.wikipedia.org/wiki/Earth',
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    description:
      'The Red Planet has captured human imagination for centuries. With its rusty red surface and evidence of ancient water flows, Mars is a prime target for exploration.',
    features: ['Red Planet', 'Two Moons', 'Polar Ice Caps', 'Ancient River Valleys'],
    trivia: 'Named after the Roman god of war due to its blood-red color',
    planetProps: {
      orbitRadius: 25,
      actualOrbitRadius: 227.9, // 227.9 million km from Sun
      orbitSpeed: 0.02,
      rotationSpeed: 0.003,
      size: 0.85,
      actualSize: 0.532, // 0.532 times Earth's diameter
      atmosphereColor: '#CD5C5C',
      textureSet: {
        map: '/textures/mars/mars.jpg',
        normalMap: '/textures/mars/mars.jpg',
        displacementMap: '/textures/mars/mars.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/mars',
      wiki: 'https://en.wikipedia.org/wiki/Mars',
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    description:
      "The largest planet in our Solar System, Jupiter is a gas giant with a Great Red Spot that's been storming for hundreds of years.",
    features: ['Largest Planet', '79+ Moons', 'Great Red Spot', 'Strongest Magnetic Field'],
    trivia: 'Named after the king of the Roman gods, ruler of sky and thunder',
    planetProps: {
      orbitRadius: 35,
      actualOrbitRadius: 778.5, // 778.5 million km from Sun
      orbitSpeed: 0.015,
      rotationSpeed: 0.004,
      size: 2.2,
      actualSize: 11.209, // 11.209 times Earth's diameter
      atmosphereColor: '#DEB887',
      textureSet: {
        map: '/textures/jupiter/jupiter.jpg',
        normalMap: '/textures/jupiter/jupiter.jpg',
        displacementMap: '/textures/jupiter/jupiter.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/jupiter',
      wiki: 'https://en.wikipedia.org/wiki/Jupiter',
    },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    description:
      'Famous for its spectacular ring system, Saturn is a gas giant with numerous moons and complex dynamics in its rings.',
    features: ['Ring System', '82+ Moons', 'Less Dense Than Water', 'Hexagonal Storm'],
    trivia: 'Named after the Roman god of agriculture and wealth',
    planetProps: {
      orbitRadius: 45,
      actualOrbitRadius: 1434.0, // 1.434 billion km from Sun
      orbitSpeed: 0.01,
      rotationSpeed: 0.004,
      size: 2,
      actualSize: 9.449, // 9.449 times Earth's diameter
      atmosphereColor: '#F4D03F',
      textureSet: {
        map: '/textures/saturn/saturn.jpg',
        normalMap: '/textures/saturn/saturn.jpg',
        displacementMap: '/textures/saturn/saturn.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/saturn',
      wiki: 'https://en.wikipedia.org/wiki/Saturn',
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    description:
      'The ice giant Uranus is unique for rotating on its side, likely due to a massive impact in its early history.',
    features: ['Ice Giant', 'Rotates Sideways', '27 Known Moons', 'Faint Ring System'],
    trivia: 'First planet discovered using a telescope, by William Herschel in 1781',
    planetProps: {
      orbitRadius: 55,
      actualOrbitRadius: 2871.0, // 2.871 billion km from Sun
      orbitSpeed: 0.007,
      rotationSpeed: 0.003,
      size: 1.6,
      actualSize: 4.007, // 4.007 times Earth's diameter
      atmosphereColor: '#87CEEB',
      textureSet: {
        map: '/textures/uranus/uranus.jpg',
        normalMap: '/textures/uranus/uranus.jpg',
        displacementMap: '/textures/uranus/uranus.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/uranus',
      wiki: 'https://en.wikipedia.org/wiki/Uranus',
    },
  },
  {
    id: 'neptune',
    name: 'Neptune',
    description:
      'The windiest planet in the Solar System, Neptune is a distant ice giant with supersonic winds and a dynamic atmosphere.',
    features: ['Fastest Winds', '14 Known Moons', 'Great Dark Spot', 'Last Gas Giant'],
    trivia: 'Discovered through mathematical predictions before being seen',
    planetProps: {
      orbitRadius: 65,
      actualOrbitRadius: 4495.0, // 4.495 billion km from Sun
      orbitSpeed: 0.005,
      rotationSpeed: 0.003,
      size: 1.5,
      actualSize: 3.883, // 3.883 times Earth's diameter
      atmosphereColor: '#6495ED',
      textureSet: {
        map: '/textures/neptune/neptune.jpg',
        normalMap: '/textures/neptune/neptune.jpg',
        displacementMap: '/textures/neptune/neptune.jpg',
      },
    },
    links: {
      nasa: 'https://solarsystem.nasa.gov/planets/neptune',
      wiki: 'https://en.wikipedia.org/wiki/Neptune',
    },
  },
];
