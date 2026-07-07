import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/features/auth';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { mutate, isPending } = useLogin();

  const onFinish = (values: { username: string; password: string }) => {
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
        Sign In
      </Typography.Title>
      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
            className="mt-2"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
