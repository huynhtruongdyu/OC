import { useCallback, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Typography } from 'antd';
import { DataTable, PermissionModal, ProtectedButton } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import {
  roleService,
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useUpdateRolePermissions,
} from '@/features';
import type {
  AdminRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@/features';

type FormValues = { name: string };

const RoleListPage = () => {
  const { data: roles, isLoading } = useRoles();
  const { mutateAsync: createRole } = useCreateRole();
  const { mutateAsync: updateRole } = useUpdateRole();
  const { mutateAsync: deleteRole } = useDeleteRole();
  const { mutateAsync: updateRolePerms } = useUpdateRolePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [permModalRole, setPermModalRole] = useState<AdminRole | null>(null);
  const [permModalPerms, setPermModalPerms] = useState<string[]>([]);
  const [form] = Form.useForm<FormValues>();

  const openCreate = useCallback(() => {
    setEditingRole(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback(
    (role: AdminRole) => {
      setEditingRole(role);
      form.setFieldsValue({ name: role.name });
      setModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  }, [form]);

  const openPermModal = useCallback(async (role: AdminRole) => {
    try {
      const perms = await roleService.getPermissions(role.id);
      setPermModalPerms(perms ?? []);
    } catch {
      setPermModalPerms([]);
    } finally {
      setPermModalRole(role);
    }
  }, []);

  const handlePermSave = useCallback(
    async (perms: string[]) => {
      if (!permModalRole) return;
      await updateRolePerms({
        id: permModalRole.id,
        data: { permissions: perms },
      });
      setPermModalRole(null);
    },
    [permModalRole, updateRolePerms],
  );

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          data: values as UpdateRoleRequest,
        });
      } else {
        await createRole(values as CreateRoleRequest);
      }
      closeModal();
    },
    [editingRole, updateRole, createRole, closeModal],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteRole(id);
    },
    [deleteRole],
  );

  const columns: DataTableColumn<AdminRole>[] = useMemo(
    () => [
      { title: 'Name', dataIndex: 'name', sortable: true },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex gap-2">
            <ProtectedButton size="small" onClick={() => openPermModal(record)} permission="roles.update">
              Permissions
            </ProtectedButton>
            <ProtectedButton size="small" onClick={() => openEdit(record)} permission="roles.update">
              Edit
            </ProtectedButton>
            <Popconfirm
              title="Delete this role?"
              onConfirm={() => handleDelete(record.id)}
            >
              <ProtectedButton size="small" danger permission="roles.delete">
                Delete
              </ProtectedButton>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [openEdit, handleDelete, openPermModal],
  );

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={4}>Roles</Typography.Title>
      <DataTable<AdminRole>
        columns={columns}
        data={roles ?? []}
        rowKey="id"
        loading={isLoading}
        toolbar={
          <ProtectedButton type="primary" permission="roles.create" onClick={openCreate}>
            Add Role
          </ProtectedButton>
        }
      />
      <Modal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={modalOpen}
        onOk={form.submit}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {permModalRole && (
        <PermissionModal
          open={!!permModalRole}
          value={permModalPerms}
          onSave={handlePermSave}
          onClose={() => setPermModalRole(null)}
        />
      )}
    </div>
  );
};

export default RoleListPage;
