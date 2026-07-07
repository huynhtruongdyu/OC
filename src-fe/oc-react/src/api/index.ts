import axios from 'axios';
import { config } from '@/config';
import { registerInterceptors } from './interceptors';

export const api = axios.create({
  baseURL: config.env.apiUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

registerInterceptors(api);
