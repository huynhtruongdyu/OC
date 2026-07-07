import { useMutation } from '@tanstack/react-query';
import { login, refresh, register } from './api';

export const useLogin = () => useMutation({ mutationFn: login });

export const useRegister = () => useMutation({ mutationFn: register });

export const useRefresh = () =>
  useMutation({ mutationFn: (refreshToken: string) => refresh(refreshToken) });
