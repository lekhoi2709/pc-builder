import type { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

export function HideSidebarIcon({
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={twMerge('h-5 w-5 xl:h-6 xl:w-6', className)}
      >
        <g clip-path="url(#clip0_4418_3658)">
          <path
            d="M7.97021 2V22"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
          <path
            d="M14.9702 9.43945L12.4102 11.9995L14.9702 14.5595"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
          <path
            d="M2 13V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
        </g>
        <defs>
          <clipPath id="clip0_4418_3658">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </i>
  );
}

export function ShowSidebarIcon({
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={twMerge('h-5 w-5 xl:h-6 xl:w-6', className)}
      >
        <g clip-path="url(#clip0_4418_3652)">
          <path
            d="M1.97021 12.98V15C1.97021 20 3.97021 22 8.97021 22H14.9702C19.9702 22 21.9702 20 21.9702 15V9C21.9702 4 19.9702 2 14.9702 2H8.97021C3.97021 2 1.97021 4 1.97021 9"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
          <path
            d="M14.9702 2V22"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
          <path
            d="M7.97021 9.43945L10.5302 11.9995L7.97021 14.5595"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-secondary-500 dark:stroke-secondary-400"
          />
        </g>
        <defs>
          <clipPath id="clip0_4418_3652">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </i>
  );
}
