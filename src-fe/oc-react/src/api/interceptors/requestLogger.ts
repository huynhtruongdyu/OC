import { logger } from '@/lib/logger';
import type { InternalAxiosRequestConfig } from 'axios';

export const onFulfilled = (config: InternalAxiosRequestConfig) => {
  logger.debug(
    `→ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    config.data,
  );
  return config;
};

export const onRejected = (error: Error) => {
  logger.error('Request error:', error.message);
  return Promise.reject(error);
};
