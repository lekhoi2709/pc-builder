import type { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

export function RightArrowIcon({
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
        className={twMerge('h-5 w-5', className)}
      >
        <path
          d="M14.43 5.92969L20.5 11.9997L14.43 18.0697"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11.01 12H20.33"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.5 12H6.97"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </i>
  );
}

export function LeftArrowIcon({
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
        className={twMerge('h-5 w-5', className)}
      >
        <path
          d="M9.57 5.92969L3.5 11.9997L9.57 18.0697"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.82 12H3.5"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.33 12H16.85"
          stroke="oklch(0.49 0.11 235)"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </i>
  );
}
