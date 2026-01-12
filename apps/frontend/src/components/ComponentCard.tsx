import { NavLink, useParams } from 'react-router';
import type { Component } from '../types/components';
import getLocalizedPrice from '../utils/getLocalizedPrice';
import useMouseShadow from '../hooks/useMouseShadow';
import type { Ref } from 'react';
import { motion, useMotionTemplate, useTransform } from 'framer-motion';

export const ComponentCard = ({
  component,
  ref,
}: {
  component: Component;
  ref?: Ref<HTMLDivElement>;
}) => {
  const { lang } = useParams();
  const { price } = getLocalizedPrice(component.price, lang || 'vn');
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      'https://placehold.co/800x1200/white/black?text=No+Image';
  };

  const { shadowX, shadowY, shadowOpacity, handlers } = useMouseShadow(8);

  const translateX = useTransform(shadowX, x => -x / 2);
  const translateY = useTransform(shadowY, y => -y / 2);

  const setRef = (node: HTMLDivElement | null) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }

    return () => {
      if (typeof ref === 'function') {
        ref(null);
      }
    };
  };

  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 0px 0px oklch(0.48 0.11 202 / ${shadowOpacity})`;

  return (
    <NavLink to={component.id}>
      <motion.div
        ref={setRef}
        className="border-secondary-300 hover:border-secondary-400 dark:border-secondary-500 bg-secondary-500/20 dark:bg-secondary-600/20 flex h-96 w-[18rem] max-w-[18rem] flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl hover:cursor-pointer"
        style={{
          x: translateX,
          y: translateY,
          boxShadow: boxShadow,
        }}
        whileTap={{
          scale: 0.98,
        }}
        layout
        layoutId={`card-${component.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          stiffness: 260,
          damping: 20,
        }}
        onMouseMove={e => handlers.handleMouseMove(e, e.currentTarget)}
        onMouseEnter={handlers.handleMouseEnter}
        onMouseLeave={handlers.handleMouseLeave}
      >
        <img
          src={component.image_url[0]}
          alt={component.name}
          className="dark:bg-secondary-700 prevent-select mb-4 h-60 min-h-60 w-full rounded-xl bg-white object-contain"
          loading="lazy"
          onError={onImageError}
          decoding="async"
        />
        <span className="flex h-full flex-col justify-between">
          <h2 className="text-md text-primary-600 dark:text-primary-100 mb-2 line-clamp-2 h-12 max-h-12">
            {component.name}
          </h2>
          <p className="text-md text-primary-500 dark:text-accent-400 mt-2 self-end font-bold">
            {price}
          </p>
        </span>
      </motion.div>
    </NavLink>
  );
};
