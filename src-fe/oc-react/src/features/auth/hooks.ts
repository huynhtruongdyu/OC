import { useMutation } from '@tanstack/react-query';
import { authService } from './services';

export const useLogin = () => useMutation({ mutationFn: authService.login });

export const useRegister = () =>
  useMutation({ mutationFn: authService.register });

export const useRefresh = () =>
  useMutation({ mutationFn: authService.refresh });
