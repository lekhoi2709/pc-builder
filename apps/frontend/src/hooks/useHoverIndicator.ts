/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface UseHoverIndicatorProps {
  widthAdjustInPixel?: number;
  rightAdjustInPixel?: number;
  activeIndex: number;
}

interface UseHoverIndicatorReturn {
  width: any;
  height: any;
  left: any;
  opacity: any;
  navRef: React.RefObject<HTMLElement | null>;
  itemRefs: React.RefObject<(HTMLElement | null)[]>;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  activeIndex: number;
}

export function useHoverIndicator({
  widthAdjustInPixel = 0,
  rightAdjustInPixel = 0,
  activeIndex,
}: UseHoverIndicatorProps): UseHoverIndicatorReturn {
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const left = useMotionValue(0);
  const opacity = useMotionValue(0);

  const springConfig = {
    stiffness: 150, // Lower = slower slide
    damping: 35, // Higher = less bounce
    mass: 1, // Higher = heavier, slower
  };
  const animatedWidth = useSpring(width, springConfig);
  const animatedHeight = useSpring(height, springConfig);
  const animatedLeft = useSpring(left, springConfig);
  const animatedOpacity = useSpring(opacity, {
    stiffness: 150, // Slower fade
    damping: 30,
  });

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const isInitialized = useRef(false);

  const updateIndicator = (index: number | null, instant = false): void => {
    if (index !== null && itemRefs.current[index]) {
      const item = itemRefs.current[index];
      const nav = navRef.current;

      if (item && nav) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const newWidth = itemRect.width + widthAdjustInPixel;
        const newHeight = itemRect.height;
        const newLeft = itemRect.left - navRect.left - rightAdjustInPixel;

        if (instant || !isInitialized.current) {
          width.set(newWidth);
          height.set(newHeight);
          left.set(newLeft);
          opacity.set(1);
          isInitialized.current = true;
        } else {
          width.set(newWidth);
          height.set(newHeight);
          left.set(newLeft);
          opacity.set(1);
        }
      }
    } else {
      opacity.set(0);
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      updateIndicator(activeIndex, true);
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, widthAdjustInPixel, rightAdjustInPixel]);

  const handleMouseEnter = (index: number): void => {
    updateIndicator(index);
  };

  const handleMouseLeave = (): void => {
    updateIndicator(activeIndex);
  };

  return {
    width: animatedWidth,
    height: animatedHeight,
    left: animatedLeft,
    opacity: animatedOpacity,
    navRef,
    itemRefs,
    handleMouseEnter,
    handleMouseLeave,
    activeIndex,
  };
}
