import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { setNavigate } from '@/lib';

const NavigateSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
};

export const Root = () => (
  <>
    <NavigateSetter />
    <Outlet />
  </>
);
