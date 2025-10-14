import { useParams } from 'react-router';
import type { Component } from '../types/components';
import getLocalizedPrice from '../utils/getLocalizedPrice';
import { memo } from 'react';

export const ComponentCard = memo(({ component }: { component: Component }) => {
  const { lang } = useParams();
  const { price } = getLocalizedPrice(component.price, lang || 'vn');
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      'https://placehold.co/800x1200/white/black?text=No+Image';
  };

  return (
    <div className="border-secondary-300 hover:border-secondary-400 dark:border-secondary-500 bg-secondary-500/20 dark:bg-secondary-600/20 dark:hover:bg-secondary-600/50 hover:bg-secondary-500/30 border-1 flex h-[24rem] w-[18rem] max-w-[18rem] flex-col justify-between rounded-2xl p-4 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-md">
      <img
        src={component.image_url[0]}
        alt={component.name}
        className="dark:bg-secondary-700 prevent-select mb-4 h-60 w-full rounded-xl bg-white object-cover"
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
    </div>
  );
});
