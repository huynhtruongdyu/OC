import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    console.log('Login:', values);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="w-full max-w-sm">
      <Typography.Title level={2} className="text-center mb-6">
        Sign In
      </Typography.Title>
      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center text-sm text-gray-500">
        Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
