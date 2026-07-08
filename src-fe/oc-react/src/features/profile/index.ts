import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { ApiResponse } from '@/types';

export type ProfileResponse = {
  userName: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
};

const getProfile = () =>
  api
    .get<ApiResponse<ProfileResponse>>('/api/v1/profile')
    .then((r) => r.data.data!);

const updateProfile = (displayName: string) =>
  api.put('/api/v1/profile', { displayName });

const changePassword = (currentPassword: string, newPassword: string) =>
  api.post('/api/v1/profile/change-password', { currentPassword, newPassword });

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: getProfile });

export const profileApi = { getProfile, updateProfile, changePassword };
