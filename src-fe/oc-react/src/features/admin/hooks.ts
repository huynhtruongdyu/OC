import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib';
import { userService, roleService, permissionService } from './services';

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  roles: () => [...adminKeys.all, 'roles'] as const,
  role: (id: string) => [...adminKeys.roles(), id] as const,
  permissionGroups: () => [...adminKeys.all, 'permissionGroups'] as const,
};

export const useUsers = () =>
  useQuery({ queryKey: adminKeys.users(), queryFn: userService.getAll });

export const useUser = (id: string) =>
  useQuery({ queryKey: adminKeys.user(id), queryFn: () => userService.getById(id), enabled: !!id });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.users() }); showToast.success('User created'); },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof userService.update>[1] }) => userService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.users() }); showToast.success('User updated'); },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.users() }); showToast.success('User deleted'); },
  });
};

export const useUserPermissions = (id: string) =>
  useQuery({ queryKey: [...adminKeys.user(id), 'permissions'], queryFn: () => userService.getPermissions(id), enabled: !!id });

export const useUpdateUserPermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof userService.updatePermissions>[1] }) => userService.updatePermissions(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.users() }); showToast.success('User permissions updated'); },
  });
};

export const useUpdateUserPassword = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) => userService.updatePassword(id, newPassword),
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.users() }); showToast.success('Password updated'); },
  });
};

export const useRoles = () =>
  useQuery({ queryKey: adminKeys.roles(), queryFn: roleService.getAll });

export const useRole = (id: string) =>
  useQuery({ queryKey: adminKeys.role(id), queryFn: () => roleService.getById(id), enabled: !!id });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.roles() }); showToast.success('Role created'); },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof roleService.update>[1] }) => roleService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.roles() }); showToast.success('Role updated'); },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleService.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.roles() }); showToast.success('Role deleted'); },
  });
};

export const useRolePermissions = (id: string) =>
  useQuery({ queryKey: [...adminKeys.role(id), 'permissions'], queryFn: () => roleService.getPermissions(id), enabled: !!id });

export const useUpdateRolePermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof roleService.updatePermissions>[1] }) => roleService.updatePermissions(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: adminKeys.roles() }); showToast.success('Permissions updated'); },
  });
};

export const usePermissionGroups = () =>
  useQuery({ queryKey: adminKeys.permissionGroups(), queryFn: permissionService.getGroups });
