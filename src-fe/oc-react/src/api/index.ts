import axios from 'axios';
import { config } from '@/config';
import { logger } from '@/lib/logger';

export const api = axios.create({
  baseURL: config.env.apiUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (request) => {
    logger.debug(`→ ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`, request.data);
    return request;
  },
  (error) => {
    logger.error('Request error:', error.message);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    logger.debug(`← ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(`← ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response.data);
    } else {
      logger.error('Response error:', error.message);
    }
    if (error.response?.status === 401) {
      // handle logout / redirect
    }
    return Promise.reject(error);
  },
);
