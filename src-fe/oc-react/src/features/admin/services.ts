import {
  getUsers, getUser, createUser, updateUser, deleteUser,
  getRoles, getRole, createRole, updateRole, deleteRole,
  getRolePermissions, updateRolePermissions, getPermissionGroups,
  getUserRoles, updateUserRoles, getUserPermissions, updateUserPermissions,
  updateUserPassword,
} from './api';
import type { CreateUserRequest, UpdateUserRequest, CreateRoleRequest, UpdateRoleRequest, UpdateRolePermissionsRequest } from './types';

export const userService = {
  getAll: () => getUsers(),
  getById: (id: string) => getUser(id),
  create: (data: CreateUserRequest) => createUser(data),
  update: (id: string, data: UpdateUserRequest) => updateUser(id, data),
  remove: (id: string) => deleteUser(id),
  getRoles: (id: string) => getUserRoles(id),
  updateRoles: (id: string, roles: string[]) => updateUserRoles(id, roles),
  getPermissions: (id: string) => getUserPermissions(id),
  updatePermissions: (id: string, data: UpdateRolePermissionsRequest) => updateUserPermissions(id, data),
  updatePassword: (id: string, newPassword: string) => updateUserPassword(id, newPassword),
};

export const roleService = {
  getAll: () => getRoles(),
  getById: (id: string) => getRole(id),
  create: (data: CreateRoleRequest) => createRole(data),
  update: (id: string, data: UpdateRoleRequest) => updateRole(id, data),
  remove: (id: string) => deleteRole(id),
  getPermissions: (id: string) => getRolePermissions(id),
  updatePermissions: (id: string, data: UpdateRolePermissionsRequest) => updateRolePermissions(id, data),
};

export const permissionService = {
  getGroups: () => getPermissionGroups(),
};
