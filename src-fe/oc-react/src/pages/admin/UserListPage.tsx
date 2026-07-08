import { useCallback, useMemo, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tag,
  Typography,
} from 'antd';
import { DataTable, PermissionModal, ProtectedButton } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useRoles,
  useUpdateUserPassword,
} from '@/features';
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/features';

type FormValues = {
  userName: string;
  email: string;
  displayName: string;
  password: string;
  roles: string[];
};

const UserListPage = () => {
  const { data: users, isLoading } = useUsers();
  const { data: allRoles } = useRoles();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const { hasPermission, hasRole } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<AdminUser | null>(
    null,
  );
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { mutateAsync: updateUserPassword, isPending: isUpdatingPassword } =
    useUpdateUserPassword();
  const [form] = Form.useForm<FormValues>();

  const openCreate = useCallback(() => {
    setEditingUser(null);
    form.resetFields();
    setSelectedPerms([]);
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback(
    (user: AdminUser) => {
      setEditingUser(user);
      form.setFieldsValue({
        userName: user.userName,
        email: user.email,
        displayName: user.displayName,
        password: '',
        roles: user.roles,
      });
      setSelectedPerms(user.permissions);
      setModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingUser(null);
    form.resetFields();
    setSelectedPerms([]);
  }, [form]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (editingUser) {
        const rest = { ...values };
        delete rest.password;
        await updateUser({
          id: editingUser.id,
          data: { ...rest, permissions: selectedPerms } as UpdateUserRequest,
        });
      } else {
        await createUser({
          ...values,
          permissions: selectedPerms,
        } as CreateUserRequest);
      }
      closeModal();
    },
    [editingUser, updateUser, createUser, closeModal, selectedPerms],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteUser(id);
    },
    [deleteUser],
  );

  const openChangePassword = useCallback((user: AdminUser) => {
    setPasswordModalUser(user);
    setNewPassword('');
    setPasswordModalOpen(true);
  }, []);

  const handleChangePassword = useCallback(async () => {
    if (passwordModalUser && newPassword.length >= 6) {
      await updateUserPassword({ id: passwordModalUser.id, newPassword });
      setPasswordModalOpen(false);
      setPasswordModalUser(null);
      setNewPassword('');
    }
  }, [passwordModalUser, newPassword, updateUserPassword]);

  const roleOptions = useMemo(
    () => allRoles?.map((r) => ({ label: r.name, value: r.name })) ?? [],
    [allRoles],
  );

  const columns: DataTableColumn<AdminUser>[] = useMemo(
    () => [
      { title: 'Username', dataIndex: 'userName', sortable: true },
      { title: 'Email', dataIndex: 'email', sortable: true },
      { title: 'Display Name', dataIndex: 'displayName', sortable: true },
      {
        title: 'Roles',
        dataIndex: 'roles',
        render: (roles: string[]) => (
          <div className="flex gap-1 flex-wrap">
            {roles.map((role) => (
              <Tag key={role}>{role}</Tag>
            ))}
          </div>
        ),
      },
      {
        title: 'Locked',
        dataIndex: 'lockoutEnabled',
        render: (v: boolean) => (v ? 'Yes' : 'No'),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex gap-2">
            <ProtectedButton size="small" permission="users.update" onClick={() => openEdit(record)}>
              Edit
            </ProtectedButton>
            <ProtectedButton size="small" permission="users.update" onClick={() => openChangePassword(record)}>
              Change Password
            </ProtectedButton>
            <Popconfirm
              title="Delete this user?"
              onConfirm={() => handleDelete(record.id)}
            >
              <ProtectedButton size="small" permission="users.delete" danger>
                Delete
              </ProtectedButton>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [openEdit, handleDelete, openChangePassword],
  );

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={4}>Users</Typography.Title>
      <DataTable<AdminUser>
        columns={columns}
        data={users ?? []}
        rowKey="id"
        loading={isLoading}
        toolbar={
          <ProtectedButton type="primary" permission="users.create" onClick={openCreate}>
            Add User
          </ProtectedButton>
        }
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        open={modalOpen}
        onOk={form.submit}
        onCancel={closeModal}
        destroyOnClose
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="userName"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="roles" label="Roles">
            <Select
              mode="multiple"
              options={roleOptions}
              placeholder="Select roles"
            />
          </Form.Item>
          <Form.Item label="Direct Permissions">
            <ProtectedButton onClick={() => setPermModalOpen(true)} permission="users.update">
              {selectedPerms.length > 0
                ? `Permissions (${selectedPerms.length} selected)`
                : 'Select permissions'}
            </ProtectedButton>
          </Form.Item>
        </Form>
      </Modal>

      <PermissionModal
        open={permModalOpen}
        value={selectedPerms}
        onSave={(perms) => setSelectedPerms(perms)}
        onClose={() => setPermModalOpen(false)}
      />

      <Modal
        title={`Change Password - ${passwordModalUser?.userName ?? ''}`}
        open={passwordModalOpen}
        onOk={handleChangePassword}
        onCancel={() => {
          setPasswordModalOpen(false);
          setPasswordModalUser(null);
          setNewPassword('');
        }}
        confirmLoading={isUpdatingPassword}
        okButtonProps={{ disabled: newPassword.length < 6 }}
        destroyOnClose
      >
        <Input.Password
          placeholder="New password (min 6 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default UserListPage;
