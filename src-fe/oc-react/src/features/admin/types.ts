export type AdminUser = {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
};

export type CreateUserRequest = {
  userName: string;
  email: string;
  displayName: string;
  password: string;
  roles: string[];
  permissions?: string[];
};

export type UpdateUserRequest = {
  userName: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions?: string[];
};

export type AdminRole = {
  id: string;
  name: string;
};

export type RoleDetail = {
  id: string;
  name: string;
  permissions: string[];
};

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = {
  name: string;
};

export type UpdateRolePermissionsRequest = {
  permissions: string[];
};

export type PermissionGroup = {
  group: string;
  permissions: string[];
};
