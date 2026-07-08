import { createBrowserRouter } from 'react-router-dom';
import { Root } from '@/components/Root';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout, AuthLayout } from '@/components/layout';
import {
  Dashboard,
  LoginPage,
  RegisterPage,
  ProductListPage,
  CategoryListPage,
  ProfilePage,
  UserListPage,
  RoleListPage,
  RoleFormPage,
  PermissionMatrixPage,
} from '@/pages';
import { CurrentPage, MockPage, SlowPage, FailedPage } from '@/pages/weather';

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <MainLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: 'weather/current', element: <CurrentPage /> },
              { path: 'weather/mock', element: <MockPage /> },
              { path: 'weather/slow', element: <SlowPage /> },
              { path: 'weather/failed', element: <FailedPage /> },
              { path: 'catalog/products', element: <ProductListPage /> },
              { path: 'catalog/categories', element: <CategoryListPage /> },
              { path: 'profile', element: <ProfilePage /> },
              { path: 'admin/users', element: <UserListPage /> },
              { path: 'admin/roles', element: <RoleListPage /> },
              { path: 'admin/roles/:id', element: <RoleFormPage /> },
              { path: 'admin/permissions', element: <PermissionMatrixPage /> },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
]);
