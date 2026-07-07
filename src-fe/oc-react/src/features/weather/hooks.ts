import { useQuery } from '@tanstack/react-query';
import { getFailedWeatherForecast, getMockWeatherForecast, getSlowWeatherForecast, getWeatherForecast } from './api';

export const weatherKeys = {
  all: ['weather'] as const,
  forecast: () => [...weatherKeys.all, 'forecast'] as const,
  mock: () => [...weatherKeys.all, 'mock'] as const,
  failed: () => [...weatherKeys.all, 'failed'] as const,
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

export const useSlowWeatherForecast = (delayMs = 5000) =>
  useQuery({
    queryKey: [...weatherKeys.all, 'slow', delayMs],
    queryFn: () => getSlowWeatherForecast(delayMs),
  });

export const useFailedWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.failed(),
    queryFn: getFailedWeatherForecast,
    retry: false,
  });
