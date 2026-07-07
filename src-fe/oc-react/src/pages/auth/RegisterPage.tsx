import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    console.log('Register:', values);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <Typography.Title level={2} className="text-center mb-6">
        Create Account
      </Typography.Title>
      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block className='mt-2'>
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
