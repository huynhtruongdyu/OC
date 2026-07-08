import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { Avatar, Dropdown, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  CloudOutlined,
  WarningOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Header, Sider, Content } = Layout;

const LoadingBar = () => {
  const isFetching = useIsFetching();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{
          width: isFetching ? '100%' : '0%',
          opacity: isFetching ? 1 : 0,
        }}
      />
    </div>
  );
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, can } = useAuth();

  const selectedKey = location.pathname === '/' ? '/' : location.pathname;
  const openKeys = [
    ...(location.pathname.startsWith('/weather') ? (['weather'] as const) : []),
    ...(location.pathname.startsWith('/catalog') ? (['catalog'] as const) : []),
    ...(location.pathname.startsWith('/admin') ? (['admin'] as const) : []),
  ];

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    {
      key: 'catalog',
      icon: <ShoppingOutlined />,
      label: 'Catalog',
      children: [
        { key: '/catalog/products', label: 'Products' },
        { key: '/catalog/categories', label: 'Categories' },
      ],
    },
    {
      key: 'weather',
      icon: <CloudOutlined />,
      label: 'Weather',
      children: [
        { key: '/weather/current', label: 'Current' },
        { key: '/weather/mock', label: 'Mock' },
        { key: '/weather/slow', label: 'Slow (5s)' },
      ],
    },
    { key: '/weather/failed', icon: <WarningOutlined />, label: 'Failed' },
    ...(can('roles.view')
      ? [
          {
            key: 'admin',
            icon: <SafetyCertificateOutlined />,
            label: 'Administration',
            children: [
              ...(can('users.view') ? [{ key: '/admin/users', label: 'Users' }] : []),
              ...(can('roles.view') ? [{ key: '/admin/roles', label: 'Roles' }] : []),
               ...(can('roles.view') ? [{ key: '/admin/permissions', label: 'Permissions' }] : []),
            ],
          } as const,
        ]
      : []),
  ];

  const dropdownItems: MenuProps['items'] = [
    { key: 'info', label: user?.displayName, disabled: true },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <IdcardOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const headerTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/weather/current') return 'Current Weather';
    if (path === '/weather/mock') return 'Mock Weather';
    if (path === '/weather/slow') return 'Slow Weather';
    if (path === '/weather/failed') return 'Failed Request';
    if (path === '/catalog/products') return 'Products';
    if (path === '/catalog/categories') return 'Categories';
    if (path === '/admin/users') return 'Users';
    if (path === '/admin/roles') return 'Roles';
    if (path.startsWith('/admin/roles/')) return 'Role Permissions';
    if (path === '/admin/permissions') return 'Permissions';
    return '';
  };

  return (
    <Layout className="h-full">
      <LoadingBar />
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="flex items-center justify-center h-16">
          <Typography.Text className="text-white text-lg font-bold truncate">
            {collapsed ? 'OC' : 'OC React'}
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'weather') navigate('/weather/current');
            else if (key === 'catalog') navigate('/catalog/products');
            else if (key === 'admin') navigate('/admin/roles');
            else navigate(key);
          }}
        />
      </Sider>
      <Layout className="h-full">
        <Header
          style={{ background: '#fff' }}
          className="px-6 flex items-center justify-between shrink-0"
        >
          <Typography.Title level={4} className="m-0">
            {headerTitle()}
          </Typography.Title>
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">
                {user?.displayName} ({user?.roles?.join(', ')})
              </span>
              <Avatar icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>
        <Content className="overflow-auto p-6">
          <div className="min-h-full bg-white rounded-lg p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
