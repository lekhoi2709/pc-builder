import type { Dispatch, SetStateAction } from 'react';
import { useOutletContext } from 'react-router';

type ContextType = {
  isSideBarOpen: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
};

export function useSideBarOpen() {
  return useOutletContext<ContextType>();
}
