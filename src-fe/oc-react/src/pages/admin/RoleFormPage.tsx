import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import { useRole, useUpdateRolePermissions } from '@/features';
import { PermissionModal } from '@/components/ui';

const RoleFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: role, isLoading: roleLoading } = useRole(id ?? '');
  const { mutateAsync: updatePermissions, isPending } = useUpdateRolePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const handleSave = useCallback(async () => {
    if (!id) return;
    await updatePermissions({ id, data: { permissions: selectedPermissions } });
    setDirty(false);
  }, [id, selectedPermissions, updatePermissions]);

  const openPermModal = useCallback(() => {
    if (role) setSelectedPermissions(role.permissions);
    setPermModalOpen(true);
  }, [role]);

  const handlePermChange = useCallback((perms: string[]) => {
    setSelectedPermissions(perms);
    setDirty(true);
  }, []);

  if (roleLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (!role) {
    return <Typography.Text type="danger">Role not found.</Typography.Text>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center justify-between">
        <Typography.Title level={4} className="m-0">
          Role: {role.name}
        </Typography.Title>
        <Button onClick={() => navigate('/admin/roles')}>Back</Button>
      </div>

      <Typography.Text strong>Permissions</Typography.Text>

      <Button onClick={openPermModal}>
        {role.permissions.length > 0
          ? `Permissions (${role.permissions.length} assigned)`
          : 'Select permissions'}
      </Button>

      <Button
        type="primary"
        size="large"
        onClick={handleSave}
        loading={isPending}
        disabled={!dirty}
      >
        Save Changes
      </Button>

      <PermissionModal
        open={permModalOpen}
        value={selectedPermissions}
        onSave={handlePermChange}
        onClose={() => setPermModalOpen(false)}
      />
    </div>
  );
};

export default RoleFormPage;
