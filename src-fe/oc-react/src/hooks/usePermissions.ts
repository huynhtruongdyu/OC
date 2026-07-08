import { useMemo } from 'react';
import { useAuth } from './useAuth';

export type Permission = string;
export type Role = string;

interface PermissionCheckOptions {
  permissions?: Permission[];
  roles?: Role[];
  requireAll?: boolean;
}

export const usePermissions = () => {
  const { user, can, hasRole: hasRoleCheck, hasAnyRole: hasAnyRoleCheck } = useAuth();

  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);
  const roles = useMemo(() => user?.roles ?? [], [user?.roles]);

  const hasPermission = (permission: Permission): boolean => can(permission);
  const hasAnyPermission = (perms: Permission[]): boolean => perms.some(hasPermission);
  const hasAllPermissions = (perms: Permission[]): boolean => perms.every(hasPermission);

  const hasRole = (role: Role): boolean => hasRoleCheck(role);
  const hasAnyRole = (roleList: Role[]): boolean => hasAnyRoleCheck(roleList);

  const check = (options: PermissionCheckOptions): boolean => {
    const { permissions: perms = [], roles: roleList = [], requireAll = false } = options;

    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(perms)
      : hasAnyPermission(perms);

    const hasRequiredRoles = roleList.length > 0 ? hasAnyRole(roleList) : true;

    return hasRequiredPermissions && hasRequiredRoles;
  };

  return {
    permissions,
    roles,
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    check,
  };
};

export default usePermissions;