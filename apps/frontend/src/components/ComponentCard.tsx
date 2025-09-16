import { useParams } from 'react-router';
import type { Component } from '../types/components';
import getLocalizedPrice from '../utils/getLocalizedPrice';

export default function ComponentCard({ component }: { component: Component }) {
  const { lang } = useParams();
  const { price } = getLocalizedPrice(component.price, lang || 'vn');

  return (
    <div className="text-primary-950 bg-primary-50 dark:text-primary-50 dark:bg-primary-800/40 flex h-[24rem] w-[18rem] max-w-[18rem] flex-col justify-between rounded-xl border border-transparent p-4 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-[101%] hover:cursor-pointer hover:shadow-lg">
      <img
        src={component.image_url[0]}
        alt={component.name}
        className="mb-4 h-60 w-full rounded-xl bg-white object-scale-down dark:mix-blend-multiply"
      />
      <span className="flex h-full flex-col justify-between">
        <h2 className="text-md mb-2 line-clamp-2 h-12 max-h-12">
          {component.name}
        </h2>
        <p className="text-md mt-2 self-end font-bold">{price}</p>
      </span>
    </div>
  );
}
