import { api } from '@/api';
import type { ApiResponse } from '@/types';
import type {
  AdminUser,
  AdminRole,
  RoleDetail,
  PermissionGroup,
  CreateUserRequest,
  UpdateUserRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  UpdateRolePermissionsRequest,
} from './types';

export const getUsers = () =>
  api
    .get<ApiResponse<AdminUser[]>>('/api/v1/admin/users')
    .then((r) => r.data.data!);

export const getUser = (id: string) =>
  api
    .get<ApiResponse<AdminUser>>(`/api/v1/admin/users/${id}`)
    .then((r) => r.data.data!);

export const createUser = (data: CreateUserRequest) =>
  api
    .post<ApiResponse<AdminUser>>('/api/v1/admin/users', data)
    .then((r) => r.data.data!);

export const updateUser = (id: string, data: UpdateUserRequest) =>
  api.put(`/api/v1/admin/users/${id}`, data);

export const deleteUser = (id: string) =>
  api.delete(`/api/v1/admin/users/${id}`);

export const getUserRoles = (id: string) =>
  api
    .get<ApiResponse<string[]>>(`/api/v1/admin/users/${id}/roles`)
    .then((r) => r.data.data!);

export const updateUserRoles = (id: string, roles: string[]) =>
  api.put(`/api/v1/admin/users/${id}/roles`, roles);

export const getUserPermissions = (id: string) =>
  api
    .get<ApiResponse<string[]>>(`/api/v1/admin/users/${id}/permissions`)
    .then((r) => r.data.data!);

export const updateUserPermissions = (
  id: string,
  data: UpdateRolePermissionsRequest,
) => api.put(`/api/v1/admin/users/${id}/permissions`, data);

export const updateUserPassword = (id: string, newPassword: string) =>
  api.put(`/api/v1/admin/users/${id}/password`, { newPassword });

export const getRoles = () =>
  api
    .get<ApiResponse<AdminRole[]>>('/api/v1/admin/roles')
    .then((r) => r.data.data!);

export const getRole = (id: string) =>
  api
    .get<ApiResponse<RoleDetail>>(`/api/v1/admin/roles/${id}`)
    .then((r) => r.data.data!);

export const createRole = (data: CreateRoleRequest) =>
  api
    .post<ApiResponse<AdminRole>>('/api/v1/admin/roles', data)
    .then((r) => r.data.data!);

export const updateRole = (id: string, data: UpdateRoleRequest) =>
  api.put(`/api/v1/admin/roles/${id}`, data);

export const deleteRole = (id: string) =>
  api.delete(`/api/v1/admin/roles/${id}`);

export const getRolePermissions = (id: string) =>
  api
    .get<ApiResponse<string[]>>(`/api/v1/admin/roles/${id}/permissions`)
    .then((r) => r.data.data!);

export const updateRolePermissions = (
  id: string,
  data: UpdateRolePermissionsRequest,
) => api.put(`/api/v1/admin/roles/${id}/permissions`, data);

export const getPermissionGroups = () =>
  api
    .get<ApiResponse<PermissionGroup[]>>('/api/v1/admin/permissions')
    .then((r) => r.data.data!);
