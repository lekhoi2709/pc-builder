import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function useMouseShadow(maxOffset = 8) {
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const shadowOpacity = useMotionValue(0);

  const shadowX = useSpring(
    useTransform(mouseX, [-1, 1], [maxOffset, -maxOffset]),
    {
      stiffness: 150,
      damping: 15,
      mass: 0.1,
    }
  );

  const shadowY = useSpring(
    useTransform(mouseY, [-1, 1], [maxOffset, -maxOffset]),
    {
      stiffness: 150,
      damping: 15,
      mass: 0.1,
    }
  );

  const smoothOpacity = useSpring(shadowOpacity, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLElement>,
    element: HTMLElement
  ) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = (x - centerX) / centerX;
    const offsetY = (y - centerY) / centerY;

    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    shadowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    shadowOpacity.set(0);
    setTimeout(() => {
      mouseX.set(0.5);
      mouseY.set(-0.5);
    }, 200);
  };

  return {
    shadowX,
    shadowY,
    shadowOpacity: smoothOpacity,
    isHovered,
    handlers: {
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave,
    },
  };
}
