import { config } from '@/config';
import { logger } from '@/lib/logger';
import type { AxiosResponse } from 'axios';
import type { ConfigWithMeta } from './types';

export const onFulfilled = (response: AxiosResponse) => {
  if (!config.isProd) {
    const meta = (response.config as ConfigWithMeta).metadata;
    const elapsed = meta?.startTime != null
      ? ` — ${Math.round(performance.now() - meta.startTime)}ms`
      : '';
    logger.debug(`← ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}${elapsed}`);
  }
  return response;
};

export const onRejected = (error: Error & { config?: unknown; response?: unknown }) => {
  if (!config.isProd) {
    const meta = (error.config as ConfigWithMeta | undefined)?.metadata;
    const elapsed = meta?.startTime != null
      ? ` — ${Math.round(performance.now() - meta.startTime)}ms`
      : '';

    if (error.response) {
      logger.error(`← ${(error.response as { status: number }).status} ${(error.config as { method?: string; url?: string })?.method?.toUpperCase()} ${(error.config as { url?: string })?.url}${elapsed}`, (error.response as { data: unknown }).data);
    } else {
      logger.error(`Response error${elapsed}:`, error.message);
    }
  }
  return Promise.reject(error);
};
