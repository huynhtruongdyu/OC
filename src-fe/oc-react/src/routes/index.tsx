import { createBrowserRouter } from 'react-router-dom';
import { Root } from '@/components/Root';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout, AuthLayout } from '@/components/layout';
import { Dashboard, LoginPage, RegisterPage } from '@/pages';
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
