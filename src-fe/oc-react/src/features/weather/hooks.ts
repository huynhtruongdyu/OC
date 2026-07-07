import { useQuery } from '@tanstack/react-query';
import { getMockWeatherForecast, getWeatherForecast } from './api';

export const weatherKeys = {
  all: ['weather'] as const,
  forecast: () => [...weatherKeys.all, 'forecast'] as const,
  mock: () => [...weatherKeys.all, 'mock'] as const,
};

export const useWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.forecast(),
    queryFn: getWeatherForecast,
  });

export const useMockWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.mock(),
    queryFn: getMockWeatherForecast,
  });
