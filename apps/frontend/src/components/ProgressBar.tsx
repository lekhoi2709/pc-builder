import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router';

export default function ProgressBar() {
  const navigation = useNavigation();
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === 'loading' || isFetching > 0) {
      setVisible(true);
      setProgress(30);

      const timer = setInterval(() => {
        setProgress(old => {
          // slowly increase progress but never hit 100% until done
          if (old < 90) return old + Math.random() * 10;
          return old;
        });
      }, 200);

      return () => clearInterval(timer);
    } else if (navigation.state === 'idle') {
      // finish the bar smoothly
      setProgress(100);
      const doneTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(doneTimer);
    }
  }, [navigation.state, isFetching]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-[9999] h-[2px] w-full rounded-2xl bg-transparent">
      <div
        className="bg-accent-300 dark:bg-accent-200 h-full transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
