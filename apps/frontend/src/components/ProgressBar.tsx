import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router';

export default function ProgressBar() {
  const navigation = useNavigation();
  const isFetching = useIsFetching({ predicate: query => query.queryKey[0] !== 'health' });
  const isBusy = navigation.state === 'loading' || isFetching > 0;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isBusy) return;

    const timer = setInterval(() => {
      setProgress(current => Math.min(90, current + Math.random() * 10));
    }, 200);

    return () => clearInterval(timer);
  }, [isBusy]);

  useEffect(() => {
    if (isBusy || progress === 0) return;

    const timer = setTimeout(() => setProgress(0), 400);
    return () => clearTimeout(timer);
  }, [isBusy, progress]);

  const visible = isBusy || progress > 0;
  const displayedProgress = isBusy ? Math.max(progress, 30) : 100;

  if (!visible) return null;

  return (
    <div className="z-9999 fixed left-0 top-0 h-1 w-full rounded-2xl bg-transparent">
      <div
        className="h-full bg-[#a6d62d] transition-[width] duration-200 ease-out dark:bg-[#d1ff52]"
        style={{ width: `${displayedProgress}%` }}
      />
    </div>
  );
}
