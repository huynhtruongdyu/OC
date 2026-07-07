import type { InternalAxiosRequestConfig } from 'axios';

const AUTH_KEY = 'oc_auth';

export const onFulfilled = (config: InternalAxiosRequestConfig) => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const { token } = JSON.parse(raw) as { token: string | null };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
};
