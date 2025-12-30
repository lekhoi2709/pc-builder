import { useMotionValue, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function AnimatedCounter({
  value,
  suffix = '',
  damping = 50,
  className,
}: {
  value: number;
  suffix: string;
  damping?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: damping,
    stiffness: 60,
  });
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on('change', latest => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return (
    <span ref={ref} className={className}>
      0 <p>{suffix}</p>
    </span>
  );
}
