import { useEffect, useRef, useState } from 'react';

interface IndicatorStyle {
  width?: number;
  height?: number;
  left?: number;
  opacity?: number;
  transform?: string;
}

type UseHoverIndicatorProps = {
  widthAdjustInPixel?: number;
  rightAdjustInPixel?: number;
  activeIndex: number;
};

type UseHoverIndicatorReturn = {
  indicatorStyle: IndicatorStyle;
  navRef: React.RefObject<HTMLElement | null>;
  itemRefs: React.RefObject<(HTMLElement | null)[]>;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  activeIndex: number;
};

export function useHoverIndicator({
  widthAdjustInPixel,
  rightAdjustInPixel,
  activeIndex,
}: UseHoverIndicatorProps): UseHoverIndicatorReturn {
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({});
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const updateIndicator = (index: number | null): void => {
    if (index !== null && itemRefs.current[index]) {
      const item = itemRefs.current[index];
      const nav = navRef.current;

      if (item && nav) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        setIndicatorStyle({
          width: itemRect.width + (widthAdjustInPixel ?? 0),
          height: itemRect.height,
          left: itemRect.left - navRect.left - (rightAdjustInPixel ?? 0),
          opacity: 1,
          transform: 'scale(1)',
        });
      }
    }
  };

  useEffect(() => {
    updateIndicator(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, widthAdjustInPixel, widthAdjustInPixel]);

  const handleMouseEnter = (index: number): void => {
    updateIndicator(index);
  };

  const handleMouseLeave = (): void => {
    updateIndicator(activeIndex);
  };

  return {
    indicatorStyle,
    navRef,
    itemRefs,
    handleMouseEnter,
    handleMouseLeave,
    activeIndex,
  };
}
