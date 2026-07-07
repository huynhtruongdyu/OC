import type { NavigateFunction } from 'react-router-dom';

let navigateFn: NavigateFunction | null = null;

export const setNavigate = (fn: NavigateFunction) => {
  navigateFn = fn;
};

export const navigate = (to: string) => {
  if (navigateFn) {
    navigateFn(to);
  } else {
    window.location.href = to;
  }
};
