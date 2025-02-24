import { useMotionValue, animate } from 'motion/react';
import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  start: boolean;
}

export function AnimatedNumber({ value, format, start }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (start) {
      motionValue.set(0);
      animate(motionValue, value, { duration: 1.5, ease: 'easeOut' });
    }
  }, [start, value, motionValue]);

  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [motionValue]);

  return <span>{format(displayValue)}</span>;
}
