import type { AxiosRequestConfig } from 'axios';

export type ConfigWithMeta = AxiosRequestConfig & {
  metadata?: { startTime: number };
};
