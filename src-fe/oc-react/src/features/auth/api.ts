import { api } from '@/api';
import type { ApiResponse } from '@/types';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<AuthResponse>>('/api/v1/public/auth/login', data).then((res) => res.data.data!);

export const register = (data: RegisterRequest) =>
  api.post<ApiResponse<AuthResponse>>('/api/v1/public/auth/register', data).then((res) => res.data.data!);

export const refresh = (refreshToken: string) =>
  api.post<ApiResponse<AuthResponse>>('/api/v1/public/auth/refresh', { refreshToken }).then((res) => res.data.data!);

