import { login, register, refresh } from './api';
import type { LoginRequest, RegisterRequest } from './types';

export const authService = {
  login: (data: LoginRequest) => login(data),
  register: (data: RegisterRequest) => register(data),
  refresh: (token: string) => refresh(token),
};
