import { memo } from 'react';
import { useHoverIndicator } from '../hooks/useHoverIndicator';
import { useTheme, type Theme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const ThemeToggle = memo(({ className }: { className?: string }) => {
  const { toggleTheme } = useTheme();

  const themeIcons = [
    {
      name: 'Light' as Theme,
      icon: <SunIcon />,
    },
    {
      name: 'Dark' as Theme,
      icon: <MoonIcon />,
    },
  ];

  const activeIndex = themeIcons.findIndex(
    val =>
      val.name ==
      ((localStorage.getItem('theme') as Theme) ?? ('Light' as Theme))
  );

  const {
    navRef,
    itemRefs,
    indicatorStyle,
    handleMouseEnter,
    handleMouseLeave,
  } = useHoverIndicator({
    activeIndex,
  });

  return (
    <nav
      ref={navRef}
      className={twMerge(
        '!bg-accent-200/20 dark:!bg-accent-400/20 rounded-4xl relative flex p-1 xl:backdrop-blur-sm',
        className
      )}
    >
      <div
        className="bg-accent-200 dark:bg-accent-400/80 backdrop-blur-xs duration-400 pointer-events-none absolute inset-0 top-1/2 -translate-y-1/2 rounded-[5rem] transition-all ease-in-out"
        style={{
          ...indicatorStyle,
        }}
      />
      {themeIcons.map((item, index: number) => (
        <span
          ref={(el: HTMLSpanElement | null) => {
            itemRefs.current[index] = el;
          }}
          key={item.name}
          className={twMerge(
            `z-50 h-fit w-fit cursor-pointer p-3 transition-colors duration-300 ease-in-out`
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => toggleTheme(item.name)}
        >
          <i
            className={twMerge(
              'dark:text-primary-100 text-primary-600 transition-colors duration-300 ease-in-out',
              activeIndex == index
                ? '!text-amber-600 dark:!text-amber-400/70'
                : ''
            )}
          >
            {item.icon}
          </i>
        </span>
      ))}
    </nav>
  );
});

export default ThemeToggle;
