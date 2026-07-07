import { useQuery } from '@tanstack/react-query';
import { getWeatherForecast } from './api';

export const weatherKeys = {
  all: ['weather'] as const,
  forecast: () => [...weatherKeys.all, 'forecast'] as const,
};

export const useWeatherForecast = () =>
  useQuery({
    queryKey: weatherKeys.forecast(),
    queryFn: getWeatherForecast,
  });
