import type { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

export function ArrowIcon({
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
        className={twMerge('h-3 w-3', className)}
        fill="currentColor"
      >
        <path d="M 0 256 L 0 128 L 128 128 Z M 128 256 L 128 128 L 256 128 Z M 0 128 L 0 0 L 128 0 Z M 128 128 L 128 0 L 256 0 Z"></path>
      </svg>
    </i>
  );
}
