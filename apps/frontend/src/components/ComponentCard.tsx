import { useParams } from 'react-router';
import type { Component } from '../types/components';
import getLocalizedPrice from '../utils/getLocalizedPrice';

export default function ComponentCard({ component }: { component: Component }) {
  const { lang } = useParams();
  const { price } = getLocalizedPrice(component, lang || 'vn');

  return (
    <div className="text-primary-950 bg-primary-100/50 border-primary-300 dark:text-primary-50 dark:bg-primary-300/30 dark:border-primary-300/30 flex h-[24rem] w-[18rem] max-w-[18rem] flex-col justify-evenly rounded-xl border p-4 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-[101%] hover:cursor-pointer hover:shadow-lg">
      <img
        src={component.image_url[0]}
        alt={component.name}
        className="mb-4 h-48 w-full rounded-2xl object-cover"
      />
      <h2 className="text-md mb-2 line-clamp-2 h-12 max-h-12">
        {component.name}
      </h2>
      <p className="text-md mt-2 self-end font-bold">{price}</p>
    </div>
  );
}
