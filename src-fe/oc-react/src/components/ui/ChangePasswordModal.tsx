import { useCallback, useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { changePassword } from '@/features/auth';

const ChangePasswordModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (values: { currentPassword: string; newPassword: string }) => {
      setLoading(true);
      try {
        const res = await changePassword(values.currentPassword, values.newPassword);
        if (res.succeeded) {
          message.success('Password changed successfully.');
          form.resetFields();
          onClose();
        } else {
          message.error('Failed to change password.');
        }
      } catch {
        message.error('Failed to change password.');
      } finally {
        setLoading(false);
      }
    },
    [form, onClose],
  );

  return (
    <Modal
      title="Change Password"
      open={open}
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
