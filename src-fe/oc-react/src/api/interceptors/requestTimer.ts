import type { InternalAxiosRequestConfig } from 'axios';
import type { ConfigWithMeta } from './types';

export const onRequest = (config: InternalAxiosRequestConfig) => {
  (config as ConfigWithMeta).metadata = { startTime: performance.now() };
  return config;
};
