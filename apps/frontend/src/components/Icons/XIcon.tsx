import type { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

export function XIcon({
  onClick,
  className,
}: {
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
}) {
  return (
    <i onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={twMerge(
          'z-10 ml-2 h-3 w-3 cursor-pointer text-red-600 hover:text-red-700 dark:text-red-900',
          className
        )}
        fill="currentColor"
      >
        <path d="M 120 136 L 120 176 L 40 256 L 0 256 L 0 216 L 80 136 Z M 256 216 L 256 256 L 216 256 L 136 176 L 136 136 L 176 136 Z M 120 80 L 120 120 L 80 120 L 0 40 L 0 0 L 40 0 Z M 256 40 L 176 120 L 136 120 L 136 80 L 216 0 L 256 0 Z"></path>
      </svg>
    </i>
  );
}
