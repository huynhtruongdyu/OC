import { useCallback, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, message, Tag, Typography } from 'antd';
import { profileApi, useProfile } from '@/features/profile';

const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile();
  const [editing, setEditing] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const handleUpdateProfile = useCallback(
    async (values: { displayName: string }) => {
      setProfileLoading(true);
      try {
        await profileApi.updateProfile(values.displayName);
        setEditing(false);
        message.success('Profile updated');
      } catch {
        message.error('Failed to update profile');
      } finally {
        setProfileLoading(false);
      }
    },
    [],
  );

  const handleChangePassword = useCallback(
    async (values: { currentPassword: string; newPassword: string }) => {
      setPwLoading(true);
      try {
        await profileApi.changePassword(values.currentPassword, values.newPassword);
        pwForm.resetFields();
        message.success('Password changed successfully');
      } catch {
        message.error('Failed to change password');
      } finally {
        setPwLoading(false);
      }
    },
    [pwForm],
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Typography.Title level={4}>Profile</Typography.Title>

      <Card title="Account Info" loading={isLoading}>
        {profile && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Username">{profile.userName}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Display Name">
              {editing ? (
                <Form
                  form={profileForm}
                  layout="inline"
                  initialValues={{ displayName: profile.displayName }}
                  onFinish={handleUpdateProfile}
                >
                  <Form.Item
                    name="displayName"
                    rules={[{ required: true }]}
                    className="mb-0"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item className="mb-0">
                    <Button type="primary" htmlType="submit" loading={profileLoading} size="small">Save</Button>
                    <Button className="ml-2" size="small" onClick={() => setEditing(false)}>Cancel</Button>
                  </Form.Item>
                </Form>
              ) : (
                <span>
                  {profile.displayName}
                  <Button type="link" size="small" className="ml-2" onClick={() => setEditing(true)}>Edit</Button>
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Roles">
              {profile.roles.map((r) => <Tag key={r}>{r}</Tag>)}
            </Descriptions.Item>
            <Descriptions.Item label="Permissions">
              <div className="flex gap-1 flex-wrap">
                {profile.permissions.map((p) => <Tag key={p} color="blue">{p}</Tag>)}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Change Password">
        <Form
          form={pwForm}
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
          className="max-w-sm"
        >
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={pwLoading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
