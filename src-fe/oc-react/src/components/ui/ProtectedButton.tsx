import { Button, type ButtonProps } from 'antd';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedButtonProps extends ButtonProps {
  permission?: string | string[];
  permissions?: string[];
  role?: string | string[];
  roles?: string[];
  requireAll?: boolean;
}

export const ProtectedButton = ({
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  disabled = false,
  children,
  ...props
}: ProtectedButtonProps) => {
  const { check } = usePermissions();

  const options = {
    permissions: permission ? [permission] : permissions,
    roles: role ? [role] : roles,
    requireAll,
  };

  const hasAccess = check(options);

  return <Button disabled={!hasAccess || disabled} {...props}>{children}</Button>;
};

export default ProtectedButton;