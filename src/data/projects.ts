export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  date: string;
  planetProps: {
    orbitRadius: number;
    orbitSpeed: number;
    rotationSpeed: number;
    size: number;
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
    github?: string;
    live?: string;
    demo?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'Full-stack web applications with modern technologies',
    technologies: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    date: '2024-01-01',
    planetProps: {
      orbitRadius: 10,
      orbitSpeed: 0.05,
      rotationSpeed: 0.002,
      size: 1,
      atmosphereColor: '#81C784',
      textureSet: {
        map: '/textures/mercury/mercury.jpg',
        normalMap: '/textures/mercury/mercury.jpg',
        displacementMap: '/textures/mercury/mercury.jpg',
      },
    },
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    description: 'Cross-platform mobile applications',
    technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
    date: '2024-02-01',
    planetProps: {
      orbitRadius: 16,
      orbitSpeed: 0.035,
      rotationSpeed: 0.003,
      size: 1.2,
      atmosphereColor: '#64B5F6',
      textureSet: {
        map: '/textures/venus/venus.jpg',
        normalMap: '/textures/venus/venus.jpg',
        displacementMap: '/textures/venus/venus.jpg',
      },
    },
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Artificial Intelligence and Machine Learning solutions',
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
    date: '2024-03-01',
    planetProps: {
      orbitRadius: 23,
      orbitSpeed: 0.025,
      rotationSpeed: 0.004,
      size: 1.4,
      atmosphereColor: '#BA68C8',
      textureSet: {
        map: '/textures/mars/mars.jpg',
        normalMap: '/textures/mars/mars.jpg',
        displacementMap: '/textures/mars/mars.jpg',
      },
    },
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Cloud infrastructure and DevOps practices',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    date: '2024-04-01',
    planetProps: {
      orbitRadius: 30,
      orbitSpeed: 0.015,
      rotationSpeed: 0.005,
      size: 1.3,
      atmosphereColor: '#FF8A65',
      textureSet: {
        map: '/textures/jupiter/jupiter.jpg',
        normalMap: '/textures/jupiter/jupiter.jpg',
        displacementMap: '/textures/jupiter/jupiter.jpg',
      },
    },
  },
];
