import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRegister } from '@/features/auth';
import { useAuth } from '@/hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { mutate, isPending } = useRegister();

  const onFinish = (values: { displayName: string; email: string; password: string }) => {
    mutate(values, {
      onSuccess: (data) => {
        setSession(data);
        navigate('/');
      },
      onError: () => {},
    });
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <Typography.Title level={2} className="text-center mb-6">
        Create Account
      </Typography.Title>
      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item name="displayName" label="Display Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Display Name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending} block className='mt-2'>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-blue-600">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
