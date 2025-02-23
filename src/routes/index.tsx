import { createFileRoute } from '@tanstack/react-router';
import { Scene } from '@/components/three/Scene';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <Scene />;
}
