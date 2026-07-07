import axios from 'axios';
import { config } from '@/config';
import { navigate } from '@/lib';
import type { ApiResponse } from '@/types';
import type { AuthResponse } from '@/features/auth';

const AUTH_KEY = 'oc_auth';
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const refreshClient = axios.create({ baseURL: config.env.apiUrl, timeout: 10000 });

const processQueue = (error: unknown, token: string | null) => {
  for (const { resolve, reject } of pendingQueue) {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  }
  pendingQueue = [];
};

export const onRejected = async (error: {
  response?: { status: number };
  config?: { _retry?: boolean; url?: string };
  message: string;
}) => {
  const originalRequest = error.config;

  if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
    return Promise.reject(error);
  }

  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return Promise.reject(error);

  const { refreshToken } = JSON.parse(raw) as { refreshToken: string | null };
  if (!refreshToken) return Promise.reject(error);

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    }).then((newToken) => {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const res = await refreshClient.post<ApiResponse<AuthResponse>>('/api/v1/public/auth/refresh', { refreshToken });
    const data = res.data.data!;

    const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    authData.token = data.token;
    authData.refreshToken = data.refreshToken;
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

    processQueue(null, data.token);
    originalRequest.headers.Authorization = `Bearer ${data.token}`;
    return axios(originalRequest);
  } catch (err) {
    processQueue(err, null);
    localStorage.removeItem(AUTH_KEY);
    navigate('/login');
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};
